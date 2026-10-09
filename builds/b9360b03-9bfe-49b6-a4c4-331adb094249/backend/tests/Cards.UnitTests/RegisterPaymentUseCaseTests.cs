using Cards.Application;
using Cards.Domain;
using Xunit;

namespace Cards.UnitTests;

internal sealed class InMemoryRepository : ICardTransactionRepository
{
    public readonly Guid ActiveCardId = Guid.NewGuid();
    public readonly Dictionary<string, CardTransaction> Stored = new();
    public int AddAttempts { get; private set; }

    public Task<IReadOnlyList<CardSummary>> ListCardsAsync(CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<CardSummary>>(new[] { new CardSummary(ActiveCardId, "**** 4242", "Demo") });

    public Task<bool> CardIsActiveAsync(Guid cardId, CancellationToken ct) =>
        Task.FromResult(cardId == ActiveCardId);

    public Task<CardTransaction?> FindByIdempotencyKeyAsync(string key, CancellationToken ct) =>
        Task.FromResult(Stored.TryGetValue(key, out var tx) ? tx : null);

    public Task<bool> TryAddAsync(CardTransaction transaction, CancellationToken ct)
    {
        AddAttempts++;
        return Task.FromResult(Stored.TryAdd(transaction.IdempotencyKey, transaction));
    }

    public Task<IReadOnlyList<CardTransaction>> ListByCardAsync(Guid cardId, int limit, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<CardTransaction>>(
            Stored.Values.Where(t => t.CardId == cardId).Take(limit).ToList());
}

internal sealed class StubGateway : ICardTransactionGateway
{
    public GatewayResult Result { get; set; } = new(true, null);
    public int Calls { get; private set; }

    public Task<GatewayResult> AuthorizeAsync(CardTransaction transaction, CancellationToken ct)
    {
        Calls++;
        return Task.FromResult(Result);
    }
}

public class RegisterPaymentUseCaseTests
{
    private readonly InMemoryRepository _repository = new();
    private readonly StubGateway _gateway = new();

    private RegisterPaymentUseCase NewUseCase(decimal max = 1000m) =>
        new(_repository, _gateway, new PaymentLimits(max), TimeProvider.System);

    private RegisterPaymentCommand Command(decimal amount = 100m, string? key = "key-12345678", Guid? card = null) =>
        new(card ?? _repository.ActiveCardId, amount, "USD", key);

    [Fact]
    public async Task Execute_ValidPayment_IsApprovedAndStored()
    {
        var outcome = await NewUseCase().ExecuteAsync(Command(), CancellationToken.None);

        Assert.False(outcome.Replayed);
        Assert.Equal(TransactionStatus.Approved, outcome.Transaction.Status);
        Assert.Single(_repository.Stored);
    }

    [Fact]
    public async Task Execute_SameKeyTwice_ReplaysWithoutSecondCharge()
    {
        var useCase = NewUseCase();
        var first = await useCase.ExecuteAsync(Command(), CancellationToken.None);
        var second = await useCase.ExecuteAsync(Command(), CancellationToken.None);

        Assert.True(second.Replayed);
        Assert.Equal(first.Transaction.Id, second.Transaction.Id);
        Assert.Equal(1, _gateway.Calls);
        Assert.Equal(1, _repository.AddAttempts);
    }

    [Fact]
    public async Task Execute_AmountAboveLimit_IsRejectedWithoutCallingGateway()
    {
        var outcome = await NewUseCase(max: 50m).ExecuteAsync(Command(amount: 100m), CancellationToken.None);

        Assert.Equal(TransactionStatus.Rejected, outcome.Transaction.Status);
        Assert.Equal(0, _gateway.Calls);
    }

    [Fact]
    public async Task Execute_GatewayDeclines_IsRejectedWithReason()
    {
        _gateway.Result = new GatewayResult(false, "Sin fondos");

        var outcome = await NewUseCase().ExecuteAsync(Command(), CancellationToken.None);

        Assert.Equal(TransactionStatus.Rejected, outcome.Transaction.Status);
        Assert.Equal("Sin fondos", outcome.Transaction.RejectionReason);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("short")]
    public async Task Execute_InvalidIdempotencyKey_Throws(string? key)
    {
        await Assert.ThrowsAsync<DomainException>(() =>
            NewUseCase().ExecuteAsync(Command(key: key), CancellationToken.None));
    }

    [Fact]
    public async Task Execute_InvalidAmount_ThrowsAndStoresNothing()
    {
        await Assert.ThrowsAsync<DomainException>(() =>
            NewUseCase().ExecuteAsync(Command(amount: -1m), CancellationToken.None));
        Assert.Empty(_repository.Stored);
    }

    [Fact]
    public async Task Execute_UnknownCard_ThrowsCardNotFound()
    {
        await Assert.ThrowsAsync<CardNotFoundException>(() =>
            NewUseCase().ExecuteAsync(Command(card: Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task List_ClampsLimitAndRequiresActiveCard()
    {
        var useCase = new ListTransactionsUseCase(_repository);
        await NewUseCase().ExecuteAsync(Command(), CancellationToken.None);

        var items = await useCase.ExecuteAsync(_repository.ActiveCardId, 0, CancellationToken.None);

        Assert.Single(items);
        await Assert.ThrowsAsync<CardNotFoundException>(() =>
            useCase.ExecuteAsync(Guid.NewGuid(), null, CancellationToken.None));
    }
}

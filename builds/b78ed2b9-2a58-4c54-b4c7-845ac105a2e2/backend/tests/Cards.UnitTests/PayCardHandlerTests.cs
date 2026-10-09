using Cards.Application;
using Cards.Domain;
using Cards.Infrastructure;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace Cards.UnitTests;

public class PayCardHandlerTests
{
    private static readonly Guid CardId = Guid.Parse("11111111-1111-4111-8111-111111111111");

    private static (PayCardHandler Handler, InMemoryCardRepository Repo) Build(ICardProcessorGateway? gateway = null)
    {
        var repo = new InMemoryCardRepository();
        repo.Add(new Card(CardId, "**** 1234", "Visa demo", 5000m, 3200m, "USD"));
        var handler = new PayCardHandler(
            repo, gateway ?? new FakeCardProcessorGateway(), TimeProvider.System, NullLogger<PayCardHandler>.Instance);
        return (handler, repo);
    }

    private static PayCardCommand Command(decimal amount, string key = "key-1", string currency = "USD", Guid? cardId = null) =>
        new(cardId ?? CardId, key, new PaymentRequest(amount, currency, "Cuenta ahorro"));

    [Fact]
    public async Task GivenValidPayment_WhenHandled_ThenOutstandingBalanceDecreases()
    {
        var (handler, repo) = Build();

        var outcome = await handler.HandleAsync(Command(500m), CancellationToken.None);

        Assert.False(outcome.Replayed);
        Assert.Equal(TransactionStatuses.Approved, outcome.Transaction.Status);
        Assert.Equal(3700m, repo.Get(CardId).AvailableBalance);
        Assert.Equal(1300m, repo.Get(CardId).OutstandingBalance);
    }

    [Fact]
    public async Task GivenSameKeyAndPayload_WhenRetried_ThenReplaysWithoutSecondCharge()
    {
        var (handler, repo) = Build();
        var first = await handler.HandleAsync(Command(200m), CancellationToken.None);

        var second = await handler.HandleAsync(Command(200m), CancellationToken.None);

        Assert.True(second.Replayed);
        Assert.Equal(first.Transaction.Id, second.Transaction.Id);
        Assert.Equal(1, repo.ApplyCalls);
        Assert.Equal(3400m, repo.Get(CardId).AvailableBalance);
    }

    [Fact]
    public async Task GivenSameKeyDifferentAmount_WhenRetried_ThenThrowsConflict()
    {
        var (handler, _) = Build();
        await handler.HandleAsync(Command(200m), CancellationToken.None);

        await Assert.ThrowsAsync<ConflictException>(() => handler.HandleAsync(Command(300m), CancellationToken.None));
    }

    [Fact]
    public async Task GivenAmountAboveOutstanding_WhenHandled_ThenThrowsValidation()
    {
        var (handler, repo) = Build();

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Command(1801m), CancellationToken.None));

        Assert.Contains("amount", ex.Errors.Keys);
        Assert.Equal(0, repo.ApplyCalls);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(10.123)]
    public async Task GivenInvalidAmount_WhenHandled_ThenThrowsValidation(double amount)
    {
        var (handler, _) = Build();

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Command((decimal)amount), CancellationToken.None));

        Assert.Contains("amount", ex.Errors.Keys);
    }

    [Fact]
    public async Task GivenMissingIdempotencyKey_WhenHandled_ThenThrowsValidation()
    {
        var (handler, _) = Build();

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Command(10m, key: " "), CancellationToken.None));

        Assert.Contains("Idempotency-Key", ex.Errors.Keys);
    }

    [Fact]
    public async Task GivenCurrencyMismatch_WhenHandled_ThenThrowsValidation()
    {
        var (handler, _) = Build();

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Command(10m, currency: "EUR"), CancellationToken.None));

        Assert.Contains("currency", ex.Errors.Keys);
    }

    [Fact]
    public async Task GivenUnknownCard_WhenHandled_ThenThrowsNotFound()
    {
        var (handler, _) = Build();

        await Assert.ThrowsAsync<NotFoundException>(
            () => handler.HandleAsync(Command(10m, cardId: Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task GivenGatewayDeclines_WhenHandled_ThenThrowsDeclinedAndKeepsBalance()
    {
        var (handler, repo) = Build(new DecliningGateway());

        await Assert.ThrowsAsync<PaymentDeclinedException>(() => handler.HandleAsync(Command(10m), CancellationToken.None));

        Assert.Equal(3200m, repo.Get(CardId).AvailableBalance);
        Assert.Equal(0, repo.ApplyCalls);
    }

    [Fact]
    public async Task GivenPayments_WhenListingTransactions_ThenReturnsNewestFirstAndRejectsBadPage()
    {
        var (handler, repo) = Build();
        await handler.HandleAsync(Command(10m, key: "k-a"), CancellationToken.None);
        await handler.HandleAsync(Command(20m, key: "k-b"), CancellationToken.None);
        var queries = new CardQueries(repo);

        var items = await queries.ListTransactionsAsync(CardId, 1, CancellationToken.None);

        Assert.Equal(2, items.Count);
        await Assert.ThrowsAsync<RequestValidationException>(
            () => queries.ListTransactionsAsync(CardId, 0, CancellationToken.None));
    }
}

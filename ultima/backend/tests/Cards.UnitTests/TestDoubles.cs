using Cards.Application;
using Cards.Domain;

namespace Cards.UnitTests;

public sealed class InMemoryCardRepository : ICardTransactionRepository
{
    private readonly Dictionary<Guid, Card> _cards = new();
    private readonly List<CardTransaction> _transactions = new();

    public int ApplyCalls { get; private set; }

    public void Add(Card card) => _cards[card.Id] = card;

    public Card Get(Guid id) => _cards[id];

    public Task<IReadOnlyList<Card>> ListCardsAsync(CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<Card>>(_cards.Values.ToList());

    public Task<Card?> FindCardAsync(Guid cardId, CancellationToken ct) =>
        Task.FromResult(_cards.GetValueOrDefault(cardId));

    public Task<IReadOnlyList<CardTransaction>> ListTransactionsAsync(Guid cardId, int offset, int limit, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<CardTransaction>>(
            _transactions.Where(t => t.CardId == cardId)
                .OrderByDescending(t => t.CreatedAt).Skip(offset).Take(limit).ToList());

    public Task<CardTransaction?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct) =>
        Task.FromResult(_transactions.FirstOrDefault(t => t.IdempotencyKey == idempotencyKey));

    public Task<ApplyPaymentResult> ApplyPaymentAsync(CardTransaction payment, CancellationToken ct)
    {
        ApplyCalls++;
        if (_transactions.Any(t => t.IdempotencyKey == payment.IdempotencyKey))
            return Task.FromResult(ApplyPaymentResult.DuplicateKey);

        var card = _cards[payment.CardId];
        if (!card.CanAcceptPayment(payment.Amount))
            return Task.FromResult(ApplyPaymentResult.ExceedsOutstanding);

        _cards[card.Id] = card with { AvailableBalance = card.AvailableBalance + payment.Amount };
        _transactions.Add(payment);
        return Task.FromResult(ApplyPaymentResult.Applied);
    }
}

public sealed class DecliningGateway : ICardProcessorGateway
{
    public Task<GatewayDecision> AuthorizePaymentAsync(Guid cardId, decimal amount, string currency, CancellationToken ct) =>
        Task.FromResult(new GatewayDecision(false, "DECLINED"));
}

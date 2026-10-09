using Cards.Application;
using Cards.Domain;

namespace Cards.Infrastructure;

public sealed class InMemoryCardRepository : ICardRepository
{
    private readonly IReadOnlyList<Card> _cards;

    public InMemoryCardRepository() : this(DemoCards.All)
    {
    }

    public InMemoryCardRepository(IReadOnlyList<Card> cards)
    {
        _cards = cards;
    }

    public Task<IReadOnlyList<Card>> ListByCustomerAsync(string customerId, CancellationToken cancellationToken)
    {
        IReadOnlyList<Card> result = _cards
            .Where(c => string.Equals(c.CustomerId, customerId, StringComparison.Ordinal))
            .ToList();
        return Task.FromResult(result);
    }

    public Task<Card?> FindByIdAsync(Guid cardId, CancellationToken cancellationToken) =>
        Task.FromResult(_cards.FirstOrDefault(c => c.Id == cardId));
}

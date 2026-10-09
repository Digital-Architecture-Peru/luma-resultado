using Cards.Domain;

namespace Cards.Application;

/// <summary>Puerto de lectura de tarjetas (adaptadores: PostgreSQL y memoria).</summary>
public interface ICardRepository
{
    Task<IReadOnlyList<Card>> ListByCustomerAsync(string customerId, CancellationToken cancellationToken);

    Task<Card?> FindByIdAsync(Guid cardId, CancellationToken cancellationToken);
}

namespace Cards.Application;

/// <summary>Puerto de lectura de tarjetas; permite sustituir PostgreSQL por otro adaptador (core de tarjetas).</summary>
public interface ICardRepository
{
    Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct);

    Task<Card?> FindByIdAsync(Guid cardId, CancellationToken ct);
}

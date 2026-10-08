using Cards.Domain;

namespace Cards.Application;

/// <summary>Puerto de lectura. La integración real con el core de tarjetas (sin definir) se implementa aquí.</summary>
public interface ICardQueryRepository
{
    Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct);

    /// <summary>Devuelve la tarjeta solo si pertenece al cliente indicado.</summary>
    Task<Card?> FindAsync(Guid customerId, Guid cardId, CancellationToken ct);

    Task<(IReadOnlyList<CardMovement> Items, int Total)> ListMovementsAsync(
        Guid cardId, int offset, int limit, CancellationToken ct);
}

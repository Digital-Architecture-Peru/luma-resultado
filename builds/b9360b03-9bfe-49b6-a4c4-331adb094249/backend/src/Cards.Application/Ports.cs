using Cards.Domain;

namespace Cards.Application;

public sealed record CardSummary(Guid Id, string MaskedPan, string HolderAlias);

public sealed record GatewayResult(bool Approved, string? Reason);

public sealed record PaymentLimits(decimal MaxAmount);

public sealed class CardNotFoundException : Exception
{
    public CardNotFoundException(Guid cardId) : base($"La tarjeta {cardId} no existe o no está activa.") { }
}

/// <summary>Puerto de persistencia. Implementado en Infrastructure (PostgreSQL).</summary>
public interface ICardTransactionRepository
{
    Task<IReadOnlyList<CardSummary>> ListCardsAsync(CancellationToken ct);
    Task<bool> CardIsActiveAsync(Guid cardId, CancellationToken ct);
    Task<CardTransaction?> FindByIdempotencyKeyAsync(string key, CancellationToken ct);

    /// <summary>Inserta la transacción. Devuelve false si la clave de idempotencia ya existía.</summary>
    Task<bool> TryAddAsync(CardTransaction transaction, CancellationToken ct);

    Task<IReadOnlyList<CardTransaction>> ListByCardAsync(Guid cardId, int limit, CancellationToken ct);
}

/// <summary>Puerto hacia el core/autorizador. La integración real aún no está definida.</summary>
public interface ICardTransactionGateway
{
    Task<GatewayResult> AuthorizeAsync(CardTransaction transaction, CancellationToken ct);
}

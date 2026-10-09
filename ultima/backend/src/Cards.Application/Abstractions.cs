using Cards.Domain;

namespace Cards.Application;

public enum ApplyPaymentResult
{
    Applied,
    ExceedsOutstanding,
    DuplicateKey
}

/// <summary>Puerto de persistencia (PostgreSQL en producción, memoria en pruebas).</summary>
public interface ICardTransactionRepository
{
    Task<IReadOnlyList<Card>> ListCardsAsync(CancellationToken ct);
    Task<Card?> FindCardAsync(Guid cardId, CancellationToken ct);
    Task<IReadOnlyList<CardTransaction>> ListTransactionsAsync(Guid cardId, int offset, int limit, CancellationToken ct);
    Task<CardTransaction?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct);

    /// <summary>Registra el pago y actualiza el saldo de forma atómica y condicional.</summary>
    Task<ApplyPaymentResult> ApplyPaymentAsync(CardTransaction payment, CancellationToken ct);
}

public sealed record GatewayDecision(bool Approved, string Reference);

/// <summary>Puerto hacia el procesador de tarjetas (integración aún sin definir).</summary>
public interface ICardProcessorGateway
{
    Task<GatewayDecision> AuthorizePaymentAsync(Guid cardId, decimal amount, string currency, CancellationToken ct);
}

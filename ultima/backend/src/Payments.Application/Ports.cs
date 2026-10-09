using Payments.Domain;

namespace Payments.Application;

public interface IPaymentRepository
{
    Task<IReadOnlyList<Account>> ListAccountsAsync(CancellationToken ct);
    Task<Account?> FindAccountAsync(Guid id, CancellationToken ct);
    Task<Payment?> FindPaymentAsync(Guid id, CancellationToken ct);
    Task<Payment?> FindByIdempotencyKeyAsync(string key, CancellationToken ct);

    /// <summary>Persiste el pago y, si está completado, debita la cuenta origen en la misma transacción.</summary>
    Task SaveAsync(Payment payment, CancellationToken ct);
}

/// <summary>Puerto hacia el sistema de autorización/liquidación (integración sin definir).</summary>
public interface IPaymentGateway
{
    Task<bool> AuthorizeAsync(Payment payment, CancellationToken ct);
}

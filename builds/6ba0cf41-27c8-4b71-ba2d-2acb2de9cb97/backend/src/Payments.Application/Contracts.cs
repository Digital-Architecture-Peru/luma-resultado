using Payments.Domain;

namespace Payments.Application;

public sealed record CreatePaymentRequest(
    string SourceAccountId,
    string BeneficiaryAccount,
    decimal Amount,
    string Currency,
    string Concept);

public sealed record PaymentResponse(
    Guid Id,
    string SourceAccountId,
    string BeneficiaryAccount,
    decimal Amount,
    string Currency,
    string Concept,
    string Status,
    string? FailureReason,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ProcessedAt)
{
    public static PaymentResponse From(Payment p) => new(
        p.Id, p.SourceAccountId, p.BeneficiaryAccount, p.Amount, p.Currency, p.Concept,
        p.Status.ToString().ToUpperInvariant(), p.FailureReason, p.CreatedAt, p.ProcessedAt);
}

/// <summary>Límites configurables por operación.</summary>
public sealed record PaymentPolicy(decimal MaxAmount);

public sealed record ProcessResult(bool Approved, string? Reason);

/// <summary>Puerto de persistencia.</summary>
public interface IPaymentRepository
{
    Task AddAsync(Payment payment, CancellationToken ct);
    Task UpdateAsync(Payment payment, CancellationToken ct);
    Task<Payment?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct);
    Task<Payment?> GetByIdAsync(Guid id, string customerId, CancellationToken ct);
    Task<IReadOnlyList<Payment>> ListByAccountAsync(string customerId, string accountId, CancellationToken ct);
}

/// <summary>Puerto de integración (sin definir): se sustituye por el procesador real.</summary>
public interface IPaymentProcessor
{
    Task<ProcessResult> ProcessAsync(Payment payment, CancellationToken ct);
}

public sealed class RequestValidationException : Exception
{
    public RequestValidationException(IDictionary<string, string[]> errors)
        : base("La solicitud no es válida.") => Errors = errors;

    public IDictionary<string, string[]> Errors { get; }
}

public sealed class DuplicateIdempotencyKeyException : Exception
{
    public DuplicateIdempotencyKeyException(string key)
        : base("Ya existe un pago registrado con la misma clave de idempotencia.") => Key = key;

    public string Key { get; }
}

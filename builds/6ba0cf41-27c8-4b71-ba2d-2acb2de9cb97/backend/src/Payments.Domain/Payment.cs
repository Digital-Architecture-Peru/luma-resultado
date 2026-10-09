namespace Payments.Domain;

public enum PaymentStatus
{
    Pending,
    Completed,
    Rejected
}

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

public sealed class InvalidStatusTransitionException : DomainException
{
    public InvalidStatusTransitionException(PaymentStatus from, PaymentStatus to)
        : base($"Transición de estado inválida: {from} -> {to}.") { }
}

/// <summary>Pago con ciclo de vida PENDING → COMPLETED | REJECTED.</summary>
public sealed class Payment
{
    private Payment() { }

    public Guid Id { get; private set; }
    public string CustomerId { get; private set; } = "";
    public string SourceAccountId { get; private set; } = "";
    public string BeneficiaryAccount { get; private set; } = "";
    public decimal Amount { get; private set; }
    public string Currency { get; private set; } = "";
    public string Concept { get; private set; } = "";
    public PaymentStatus Status { get; private set; }
    public string? FailureReason { get; private set; }
    public string IdempotencyKey { get; private set; } = "";
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? ProcessedAt { get; private set; }

    public static Payment Create(
        string customerId,
        string sourceAccountId,
        string beneficiaryAccount,
        decimal amount,
        string currency,
        string concept,
        string idempotencyKey,
        DateTimeOffset now)
    {
        RequireText(customerId, nameof(customerId));
        RequireText(sourceAccountId, nameof(sourceAccountId));
        RequireText(beneficiaryAccount, nameof(beneficiaryAccount));
        RequireText(idempotencyKey, nameof(idempotencyKey));
        if (amount <= 0)
            throw new DomainException("El monto debe ser mayor que cero.");
        if (decimal.Round(amount, 2) != amount)
            throw new DomainException("El monto admite como máximo dos decimales.");
        if (string.IsNullOrWhiteSpace(currency) || currency.Length != 3)
            throw new DomainException("La moneda debe ser un código ISO 4217 de 3 letras.");

        return new Payment
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            SourceAccountId = sourceAccountId,
            BeneficiaryAccount = beneficiaryAccount,
            Amount = amount,
            Currency = currency.ToUpperInvariant(),
            Concept = concept ?? "",
            Status = PaymentStatus.Pending,
            IdempotencyKey = idempotencyKey,
            CreatedAt = now
        };
    }

    /// <summary>Reconstruye un pago persistido sin revalidar reglas de creación.</summary>
    public static Payment Restore(
        Guid id, string customerId, string sourceAccountId, string beneficiaryAccount,
        decimal amount, string currency, string concept, PaymentStatus status,
        string? failureReason, string idempotencyKey, DateTimeOffset createdAt, DateTimeOffset? processedAt)
        => new()
        {
            Id = id,
            CustomerId = customerId,
            SourceAccountId = sourceAccountId,
            BeneficiaryAccount = beneficiaryAccount,
            Amount = amount,
            Currency = currency,
            Concept = concept,
            Status = status,
            FailureReason = failureReason,
            IdempotencyKey = idempotencyKey,
            CreatedAt = createdAt,
            ProcessedAt = processedAt
        };

    public void Complete(DateTimeOffset now)
    {
        Transition(PaymentStatus.Completed);
        ProcessedAt = now;
    }

    public void Reject(string reason, DateTimeOffset now)
    {
        RequireText(reason, nameof(reason));
        Transition(PaymentStatus.Rejected);
        FailureReason = reason;
        ProcessedAt = now;
    }

    private void Transition(PaymentStatus target)
    {
        if (Status != PaymentStatus.Pending)
            throw new InvalidStatusTransitionException(Status, target);
        Status = target;
    }

    private static void RequireText(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException($"El campo '{name}' es obligatorio.");
    }
}

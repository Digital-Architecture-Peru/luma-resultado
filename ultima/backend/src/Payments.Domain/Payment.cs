namespace Payments.Domain;

public enum PaymentStatus
{
    Pending,
    Completed,
    Rejected
}

/// <summary>Pago de un cliente. La cuenta ya viene enmascarada (****1234).</summary>
public sealed record Payment(
    Guid Id,
    Guid CustomerId,
    string Beneficiary,
    string AccountMasked,
    decimal Amount,
    string Currency,
    PaymentStatus Status,
    DateTimeOffset PaidAt,
    string Reference);

using System.Text.RegularExpressions;

namespace Payments.Domain;

public enum PaymentStatus { Pending, Completed, Rejected }

public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

public sealed record Account(Guid Id, string Number, string Holder, string Currency, decimal Balance);

public sealed record PaymentRequest(
    Guid SourceAccountId,
    string BeneficiaryAccount,
    decimal Amount,
    string Currency,
    string Reference);

public sealed record PaymentSnapshot(
    Guid Id,
    string IdempotencyKey,
    Guid SourceAccountId,
    string BeneficiaryAccount,
    decimal Amount,
    string Currency,
    PaymentStatus Status,
    string Reference,
    DateTimeOffset CreatedAt);

public sealed class Payment
{
    public const int MaxReferenceLength = 140;
    private static readonly Regex BeneficiaryPattern = new("^[A-Za-z0-9]{8,20}$", RegexOptions.Compiled);

    private Payment(PaymentSnapshot s)
    {
        Id = s.Id;
        IdempotencyKey = s.IdempotencyKey;
        SourceAccountId = s.SourceAccountId;
        BeneficiaryAccount = s.BeneficiaryAccount;
        Amount = s.Amount;
        Currency = s.Currency;
        Status = s.Status;
        Reference = s.Reference;
        CreatedAt = s.CreatedAt;
    }

    public Guid Id { get; }
    public string IdempotencyKey { get; }
    public Guid SourceAccountId { get; }
    public string BeneficiaryAccount { get; }
    public decimal Amount { get; }
    public string Currency { get; }
    public PaymentStatus Status { get; private set; }
    public string Reference { get; }
    public DateTimeOffset CreatedAt { get; }

    public static Payment Create(
        Account source, PaymentRequest request, string idempotencyKey, decimal maxAmount, DateTimeOffset now)
    {
        ArgumentNullException.ThrowIfNull(source);
        ArgumentNullException.ThrowIfNull(request);
        var normalized = Normalize(request);
        Validate(source, normalized, maxAmount);
        return new Payment(new PaymentSnapshot(
            Guid.NewGuid(), idempotencyKey, source.Id, normalized.BeneficiaryAccount, normalized.Amount,
            normalized.Currency, PaymentStatus.Pending, normalized.Reference, now));
    }

    public static Payment Rehydrate(PaymentSnapshot snapshot) => new(snapshot);

    public bool Matches(PaymentRequest request)
    {
        var n = Normalize(request);
        return SourceAccountId == n.SourceAccountId
            && BeneficiaryAccount == n.BeneficiaryAccount
            && Amount == n.Amount
            && Currency == n.Currency
            && Reference == n.Reference;
    }

    public void Complete() => Transition(PaymentStatus.Completed);

    public void Reject() => Transition(PaymentStatus.Rejected);

    private void Transition(PaymentStatus target)
    {
        if (Status != PaymentStatus.Pending)
            throw new DomainException("Solo un pago pendiente puede cambiar de estado.");
        Status = target;
    }

    private static PaymentRequest Normalize(PaymentRequest r) => r with
    {
        BeneficiaryAccount = (r.BeneficiaryAccount ?? string.Empty).Trim(),
        Currency = (r.Currency ?? string.Empty).Trim().ToUpperInvariant(),
        Reference = (r.Reference ?? string.Empty).Trim(),
    };

    private static void Validate(Account source, PaymentRequest r, decimal maxAmount)
    {
        if (r.Amount <= 0) throw new DomainException("El monto debe ser mayor que 0.");
        if (decimal.Round(r.Amount, 2) != r.Amount) throw new DomainException("El monto admite como máximo dos decimales.");
        if (r.Amount > maxAmount) throw new DomainException($"El monto supera el límite por transacción ({maxAmount}).");
        if (!BeneficiaryPattern.IsMatch(r.BeneficiaryAccount))
            throw new DomainException("La cuenta beneficiaria debe ser alfanumérica de 8 a 20 caracteres.");
        if (string.Equals(r.BeneficiaryAccount, source.Number, StringComparison.OrdinalIgnoreCase))
            throw new DomainException("La cuenta origen y la beneficiaria deben ser distintas.");
        if (r.Currency != source.Currency)
            throw new DomainException("La moneda del pago debe coincidir con la de la cuenta origen.");
        if (r.Reference.Length > MaxReferenceLength)
            throw new DomainException($"La referencia admite como máximo {MaxReferenceLength} caracteres.");
        if (source.Balance < r.Amount) throw new DomainException("Saldo insuficiente.");
    }
}

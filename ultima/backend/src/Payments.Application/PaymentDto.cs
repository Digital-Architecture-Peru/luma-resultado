using System.Globalization;
using Payments.Domain;

namespace Payments.Application;

/// <summary>Importe como string decimal para no perder precisión en JS.</summary>
public sealed record PaymentDto(
    Guid Id,
    string Beneficiary,
    string AccountMasked,
    string Amount,
    string Currency,
    string Status,
    DateTimeOffset PaidAt,
    string Reference)
{
    public static PaymentDto From(Payment p) => new(
        p.Id,
        p.Beneficiary,
        p.AccountMasked,
        p.Amount.ToString("F2", CultureInfo.InvariantCulture),
        p.Currency,
        p.Status.ToString().ToUpperInvariant(),
        p.PaidAt,
        p.Reference);
}

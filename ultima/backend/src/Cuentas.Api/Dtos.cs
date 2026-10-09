using System.Globalization;
using Cuentas.Application;
using Cuentas.Domain;

namespace Cuentas.Api;

// Los montos viajan como string para evitar errores de punto flotante (D4).
public sealed record AccountDto(long Id, string Number, string Holder, string Currency, string Balance);

public sealed record LedgerEntryDto(
    long Id, long AccountId, long TransferId, string Type, string Amount, string? Description, DateTimeOffset CreatedAt);

public sealed record TransferRequest(long SourceAccountId, long TargetAccountId, string? Amount, string? Description);

public sealed record TransferResponse(
    long Id, long SourceAccountId, long TargetAccountId, string Amount, string Status, DateTimeOffset CreatedAt);

public static class Mapping
{
    public static string FormatAmount(decimal value) => value.ToString("F2", CultureInfo.InvariantCulture);

    public static decimal ParseAmount(string? raw)
    {
        if (!decimal.TryParse(raw, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out var amount))
        {
            throw new DomainException(ErrorCodes.Validation, "El monto no es un número válido.");
        }

        return amount;
    }

    public static AccountDto ToDto(this Account a) =>
        new(a.Id, a.Number, a.Holder, a.Currency, FormatAmount(a.Balance));

    public static LedgerEntryDto ToDto(this LedgerEntry e) =>
        new(e.Id, e.AccountId, e.TransferId, e.Type.ToString().ToUpperInvariant(),
            FormatAmount(e.Amount), e.Description, e.CreatedAt);

    public static TransferResponse ToDto(this TransferResult r) =>
        new(r.TransferId, r.SourceAccountId, r.TargetAccountId, FormatAmount(r.Amount), r.Status, r.CreatedAt);
}

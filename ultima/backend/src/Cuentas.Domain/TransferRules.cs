namespace Cuentas.Domain;

public static class TransferRules
{
    /// <summary>Valida y aplica débito y crédito. Si falla una regla no muta ninguna cuenta.</summary>
    public static void Apply(Account source, Account target, decimal amount)
    {
        Money.EnsureValid(amount);

        if (source.Id == target.Id)
        {
            throw new DomainException(ErrorCodes.SameAccount, "La cuenta origen y destino deben ser distintas.");
        }

        if (!string.Equals(source.Currency, target.Currency, StringComparison.Ordinal))
        {
            throw new DomainException(ErrorCodes.CurrencyMismatch, "Las cuentas deben tener la misma moneda.");
        }

        source.Debit(amount);
        target.Credit(amount);
    }
}

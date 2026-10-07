namespace CardsQuery.Api.Atoms;

/// <summary>Átomo: valor monetario inmutable con moneda ISO.</summary>
public readonly record struct Money(decimal Amount, string Currency)
{
    public static Money Of(decimal amount, string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) || currency.Length != 3)
        {
            throw new ArgumentException("La moneda debe ser un código ISO de 3 letras.", nameof(currency));
        }

        return new Money(decimal.Round(amount, 2), currency.ToUpperInvariant());
    }
}

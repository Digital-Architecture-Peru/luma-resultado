using System.Text.RegularExpressions;

namespace Cards.Domain;

/// <summary>Error de regla de negocio o de validación del dominio.</summary>
public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

/// <summary>Importe con moneda ISO 4217. Siempre positivo y con máximo 2 decimales.</summary>
public sealed partial record Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    private Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public static Money Create(decimal amount, string? currency)
    {
        if (amount <= 0)
        {
            throw new DomainException("El importe debe ser mayor que cero.");
        }

        if (decimal.Round(amount, 2) != amount)
        {
            throw new DomainException("El importe admite como máximo 2 decimales.");
        }

        var code = currency?.Trim().ToUpperInvariant() ?? string.Empty;
        if (!CurrencyPattern().IsMatch(code))
        {
            throw new DomainException("La moneda debe ser un código ISO de 3 letras.");
        }

        return new Money(amount, code);
    }

    [GeneratedRegex("^[A-Z]{3}$")]
    private static partial Regex CurrencyPattern();
}

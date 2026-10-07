namespace CardsQuery.Api.Atoms;

/// <summary>Átomo: enmascara el número de tarjeta dejando visibles solo los últimos 4 dígitos.</summary>
public static class CardNumberMask
{
    public static string Mask(string number)
    {
        var digits = new string((number ?? string.Empty).Where(char.IsDigit).ToArray());
        if (digits.Length < 4)
        {
            throw new ArgumentException("El número de tarjeta debe tener al menos 4 dígitos.", nameof(number));
        }

        return $"**** **** **** {digits[^4..]}";
    }
}

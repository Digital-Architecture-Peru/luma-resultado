namespace Cards.Application;

public static class CardMasking
{
    public static string Mask(string panLast4)
    {
        if (panLast4 is null || panLast4.Length != 4 || !panLast4.All(char.IsAsciiDigit))
        {
            throw new ArgumentException("Los últimos 4 dígitos deben ser exactamente 4 números.", nameof(panLast4));
        }

        return $"**** **** **** {panLast4}";
    }

    public static string FormatExpiry(int month, int year)
    {
        if (month is < 1 or > 12)
        {
            throw new ArgumentOutOfRangeException(nameof(month), "El mes debe estar entre 1 y 12.");
        }

        return $"{month:00}/{year % 100:00}";
    }
}

namespace Cards.Domain;

public static class PanMasker
{
    private const string Prefix = "**** **** **** ";

    public static string FromLast4(string last4)
    {
        if (!IsValidLast4(last4))
        {
            throw new ArgumentException("last4 debe contener exactamente 4 dígitos.", nameof(last4));
        }

        return Prefix + last4;
    }

    private static bool IsValidLast4(string? value) =>
        value is { Length: 4 } && value.All(char.IsAsciiDigit);
}

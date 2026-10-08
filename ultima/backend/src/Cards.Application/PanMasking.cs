namespace Cards.Application;

public static class PanMasking
{
    public static string Mask(string last4)
    {
        if (last4 is null || last4.Length != 4 || !last4.All(char.IsAsciiDigit))
        {
            throw new ArgumentException("last4 debe contener exactamente 4 dígitos.", nameof(last4));
        }

        return $"**** {last4}";
    }
}

namespace Pagos.Application;

public static class CuentaMask
{
    private const int DigitosVisibles = 4;
    private const string Prefijo = "****";

    /// <summary>Deja visibles solo los últimos 4 caracteres. Es idempotente.</summary>
    public static string Enmascarar(string cuenta)
    {
        if (string.IsNullOrWhiteSpace(cuenta))
        {
            return Prefijo;
        }

        var limpia = cuenta.Trim();
        var cola = limpia.Length <= DigitosVisibles ? limpia : limpia[^DigitosVisibles..];
        return Prefijo + cola;
    }
}

namespace Pagos.Domain;

public enum EstadoPago
{
    Pendiente,
    Procesado,
    Rechazado,
    Anulado
}

public static class EstadoPagoExtensions
{
    /// <summary>Convierte el texto almacenado (p. ej. "PROCESADO") al enum; false si no es válido.</summary>
    public static bool TryParse(string? texto, out EstadoPago estado)
    {
        return Enum.TryParse(texto?.Trim(), ignoreCase: true, out estado)
            && Enum.IsDefined(typeof(EstadoPago), estado);
    }

    public static string ToCodigo(this EstadoPago estado) => estado.ToString().ToUpperInvariant();
}

public sealed record Pago(
    Guid Id,
    string CuentaId,
    string Referencia,
    string Beneficiario,
    decimal Monto,
    string Moneda,
    EstadoPago Estado,
    DateTimeOffset FechaPago,
    string Canal);

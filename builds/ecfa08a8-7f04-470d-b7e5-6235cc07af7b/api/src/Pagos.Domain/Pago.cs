namespace Pagos.Domain;

public enum EstadoPago
{
    Pendiente,
    Procesado,
    Rechazado,
    Reversado
}

/// <summary>Pago realizado por un cliente. La cuenta destino se guarda ya enmascarada.</summary>
public sealed record Pago(
    Guid Id,
    Guid ClienteId,
    string Referencia,
    string Beneficiario,
    string CuentaDestinoMask,
    decimal Monto,
    string Moneda,
    EstadoPago Estado,
    DateTimeOffset FechaPago);

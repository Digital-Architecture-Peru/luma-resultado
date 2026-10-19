namespace Pagos.Domain;

public enum EstadoPago
{
    Pendiente,
    Aplicado,
    Rechazado
}

/// <summary>Pago de un cliente. La cuenta destino siempre llega enmascarada.</summary>
public sealed record Pago(
    Guid Id,
    string ClienteId,
    string Referencia,
    string Beneficiario,
    string CuentaDestinoMask,
    decimal Monto,
    string Moneda,
    EstadoPago Estado,
    DateTimeOffset FechaPago,
    string Canal);

namespace Cuentas.Application;

/// <summary>Cuenta bancaria (modelo de dominio de solo lectura).</summary>
public sealed record Cuenta(
    Guid Id,
    Guid ClienteId,
    string Numero,
    string Tipo,
    string Moneda,
    decimal Saldo,
    string Estado,
    DateTimeOffset ActualizadoEn);

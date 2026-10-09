namespace Cuentas.Application.Dtos;

/// <summary>Vista pública de una cuenta: el número va enmascarado.</summary>
public sealed record CuentaDto(
    Guid Id,
    string NumeroEnmascarado,
    string Tipo,
    string Moneda,
    decimal Saldo,
    string Estado,
    DateTimeOffset ActualizadoEn);

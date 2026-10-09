using Cuentas.Domain;

namespace Cuentas.Application;

public sealed record RealizarTransferenciaComando(
    Guid TitularId,
    Guid OrigenId,
    Guid DestinoId,
    decimal Monto,
    string Moneda,
    string? Concepto,
    string IdempotencyKey);

public sealed record ComprobanteTransferencia(
    Guid Id,
    Guid OrigenId,
    Guid DestinoId,
    decimal Monto,
    string Moneda,
    string? Concepto,
    string Estado,
    DateTime CreadoEn,
    decimal SaldoOrigen);

public sealed record ResultadoTransferencia(ComprobanteTransferencia Comprobante, bool Repetido);

public sealed record CuentaDto(Guid Id, string NumeroEnmascarado, string Moneda, decimal Saldo);

public sealed class ConflictoIdempotenciaException : Exception
{
    public ConflictoIdempotenciaException()
        : base("La clave de idempotencia ya se usó con una solicitud distinta.") { }
}

public sealed class CuentaNoEncontradaException : Exception
{
    public CuentaNoEncontradaException() : base("Cuenta no encontrada.") { }
}

/// <summary>Puerto de lectura de cuentas.</summary>
public interface ICuentaRepository
{
    Task<IReadOnlyList<Cuenta>> ListarPorTitularAsync(Guid titularId, CancellationToken ct);
}

/// <summary>Operaciones dentro de una única transacción de base de datos.</summary>
public interface ITransferenciaTx
{
    Task<ComprobanteTransferencia?> BuscarPorClaveAsync(string idempotencyKey, CancellationToken ct);

    /// <summary>Bloquea (FOR UPDATE) las cuentas en orden ascendente de id.</summary>
    Task<IReadOnlyList<Cuenta>> BloquearCuentasAsync(Guid a, Guid b, CancellationToken ct);

    Task ActualizarSaldoAsync(Cuenta cuenta, CancellationToken ct);

    Task InsertarTransferenciaAsync(ComprobanteTransferencia comprobante, string idempotencyKey, CancellationToken ct);

    Task InsertarMovimientoAsync(
        Guid cuentaId, Guid transferenciaId, char tipo, decimal monto, decimal saldoResultante,
        DateTime creadoEn, CancellationToken ct);
}

public interface IUnitOfWork
{
    Task<T> EjecutarAsync<T>(Func<ITransferenciaTx, Task<T>> trabajo, CancellationToken ct);
}

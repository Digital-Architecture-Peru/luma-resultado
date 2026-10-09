using Cuentas.Domain;

namespace Cuentas.Application;

public sealed class RealizarTransferencia
{
    private const string EstadoCompletada = "COMPLETADA";

    private readonly IUnitOfWork _unitOfWork;
    private readonly TimeProvider _reloj;

    public RealizarTransferencia(IUnitOfWork unitOfWork, TimeProvider reloj)
    {
        _unitOfWork = unitOfWork;
        _reloj = reloj;
    }

    public Task<ResultadoTransferencia> EjecutarAsync(RealizarTransferenciaComando cmd, CancellationToken ct)
    {
        ReglasTransferencia.ValidarConcepto(cmd.Concepto);
        return _unitOfWork.EjecutarAsync(tx => EjecutarEnTransaccionAsync(tx, cmd, ct), ct);
    }

    private async Task<ResultadoTransferencia> EjecutarEnTransaccionAsync(
        ITransferenciaTx tx, RealizarTransferenciaComando cmd, CancellationToken ct)
    {
        var existente = await tx.BuscarPorClaveAsync(cmd.IdempotencyKey, ct);
        if (existente is not null)
        {
            if (!EsMismaSolicitud(existente, cmd))
                throw new ConflictoIdempotenciaException();
            return new ResultadoTransferencia(existente, Repetido: true);
        }

        var cuentas = await tx.BloquearCuentasAsync(cmd.OrigenId, cmd.DestinoId, ct);
        var origen = cuentas.FirstOrDefault(c => c.Id == cmd.OrigenId && c.TitularId == cmd.TitularId)
                     ?? throw new CuentaNoEncontradaException();
        var destino = cuentas.FirstOrDefault(c => c.Id == cmd.DestinoId && c.TitularId == cmd.TitularId)
                      ?? throw new CuentaNoEncontradaException();

        ReglasTransferencia.Validar(origen, destino, cmd.Monto, cmd.Moneda);

        origen.Debitar(cmd.Monto);
        destino.Acreditar(cmd.Monto);

        var ahora = _reloj.GetUtcNow().UtcDateTime;
        var comprobante = new ComprobanteTransferencia(
            Guid.NewGuid(), origen.Id, destino.Id, cmd.Monto, cmd.Moneda,
            cmd.Concepto, EstadoCompletada, ahora, origen.Saldo);

        await tx.ActualizarSaldoAsync(origen, ct);
        await tx.ActualizarSaldoAsync(destino, ct);
        await tx.InsertarTransferenciaAsync(comprobante, cmd.IdempotencyKey, ct);
        await tx.InsertarMovimientoAsync(origen.Id, comprobante.Id, 'D', cmd.Monto, origen.Saldo, ahora, ct);
        await tx.InsertarMovimientoAsync(destino.Id, comprobante.Id, 'C', cmd.Monto, destino.Saldo, ahora, ct);

        return new ResultadoTransferencia(comprobante, Repetido: false);
    }

    private static bool EsMismaSolicitud(ComprobanteTransferencia c, RealizarTransferenciaComando cmd) =>
        c.OrigenId == cmd.OrigenId && c.DestinoId == cmd.DestinoId &&
        c.Monto == cmd.Monto && c.Moneda == cmd.Moneda;
}

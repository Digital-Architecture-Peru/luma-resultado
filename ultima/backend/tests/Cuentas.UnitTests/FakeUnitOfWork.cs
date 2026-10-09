using Cuentas.Application;
using Cuentas.Domain;

namespace Cuentas.UnitTests;

/// <summary>Doble en memoria de los puertos de persistencia.</summary>
internal sealed class FakeUnitOfWork : IUnitOfWork, ITransferenciaTx
{
    public Dictionary<Guid, Cuenta> Cuentas { get; } = new();
    public Dictionary<string, ComprobanteTransferencia> PorClave { get; } = new();
    public List<(Guid CuentaId, char Tipo, decimal Monto)> Movimientos { get; } = new();

    public Task<T> EjecutarAsync<T>(Func<ITransferenciaTx, Task<T>> trabajo, CancellationToken ct) => trabajo(this);

    public Task<ComprobanteTransferencia?> BuscarPorClaveAsync(string idempotencyKey, CancellationToken ct) =>
        Task.FromResult(PorClave.GetValueOrDefault(idempotencyKey));

    public Task<IReadOnlyList<Cuenta>> BloquearCuentasAsync(Guid a, Guid b, CancellationToken ct)
    {
        IReadOnlyList<Cuenta> lista = new[] { a, b }.Distinct().Order()
            .Where(Cuentas.ContainsKey).Select(id => Cuentas[id]).ToList();
        return Task.FromResult(lista);
    }

    public Task ActualizarSaldoAsync(Cuenta cuenta, CancellationToken ct) => Task.CompletedTask;

    public Task InsertarTransferenciaAsync(ComprobanteTransferencia c, string idempotencyKey, CancellationToken ct)
    {
        PorClave[idempotencyKey] = c;
        return Task.CompletedTask;
    }

    public Task InsertarMovimientoAsync(
        Guid cuentaId, Guid transferenciaId, char tipo, decimal monto, decimal saldoResultante,
        DateTime creadoEn, CancellationToken ct)
    {
        Movimientos.Add((cuentaId, tipo, monto));
        return Task.CompletedTask;
    }
}

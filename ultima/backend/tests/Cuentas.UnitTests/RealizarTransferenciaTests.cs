using Cuentas.Application;
using Cuentas.Domain;
using Xunit;

namespace Cuentas.UnitTests;

public class RealizarTransferenciaTests
{
    private static readonly Guid Titular = Guid.NewGuid();
    private readonly FakeUnitOfWork _uow = new();
    private readonly Cuenta _origen;
    private readonly Cuenta _destino;
    private readonly RealizarTransferencia _caso;

    public RealizarTransferenciaTests()
    {
        _origen = new Cuenta(Guid.NewGuid(), Titular, "****-0001", "USD", 100m);
        _destino = new Cuenta(Guid.NewGuid(), Titular, "****-0002", "USD", 20m);
        _uow.Cuentas[_origen.Id] = _origen;
        _uow.Cuentas[_destino.Id] = _destino;
        _caso = new RealizarTransferencia(_uow, TimeProvider.System);
    }

    private RealizarTransferenciaComando Comando(decimal monto = 30m, string clave = "k-1", Guid? titular = null) =>
        new(titular ?? Titular, _origen.Id, _destino.Id, monto, "USD", "alquiler", clave);

    [Fact]
    public async Task GivenSolicitudValida_WhenEjecutar_ThenMueveSaldosYRegistraMovimientos()
    {
        var resultado = await _caso.EjecutarAsync(Comando(), CancellationToken.None);

        Assert.False(resultado.Repetido);
        Assert.Equal(70m, _origen.Saldo);
        Assert.Equal(50m, _destino.Saldo);
        Assert.Equal(70m, resultado.Comprobante.SaldoOrigen);
        Assert.Equal(2, _uow.Movimientos.Count);
        Assert.Contains(_uow.Movimientos, m => m.CuentaId == _origen.Id && m.Tipo == 'D' && m.Monto == 30m);
        Assert.Contains(_uow.Movimientos, m => m.CuentaId == _destino.Id && m.Tipo == 'C' && m.Monto == 30m);
    }

    [Fact]
    public async Task GivenMismaClave_WhenEjecutarDosVeces_ThenDevuelveMismoResultadoSinDobleDebito()
    {
        var primero = await _caso.EjecutarAsync(Comando(), CancellationToken.None);
        var segundo = await _caso.EjecutarAsync(Comando(), CancellationToken.None);

        Assert.True(segundo.Repetido);
        Assert.Equal(primero.Comprobante.Id, segundo.Comprobante.Id);
        Assert.Equal(70m, _origen.Saldo);
        Assert.Equal(2, _uow.Movimientos.Count);
    }

    [Fact]
    public async Task GivenMismaClaveConOtroMonto_WhenEjecutar_ThenLanzaConflicto()
    {
        await _caso.EjecutarAsync(Comando(30m), CancellationToken.None);

        await Assert.ThrowsAsync<ConflictoIdempotenciaException>(
            () => _caso.EjecutarAsync(Comando(31m), CancellationToken.None));
        Assert.Equal(70m, _origen.Saldo);
    }

    [Fact]
    public async Task GivenCuentaDeOtroTitular_WhenEjecutar_ThenNoEncontrada()
    {
        await Assert.ThrowsAsync<CuentaNoEncontradaException>(
            () => _caso.EjecutarAsync(Comando(titular: Guid.NewGuid()), CancellationToken.None));
    }

    [Fact]
    public async Task GivenSaldoInsuficiente_WhenEjecutar_ThenRechazaYNoRegistra()
    {
        var ex = await Assert.ThrowsAsync<ReglaNegocioException>(
            () => _caso.EjecutarAsync(Comando(500m), CancellationToken.None));

        Assert.Equal("saldo_insuficiente", ex.Codigo);
        Assert.Empty(_uow.PorClave);
        Assert.Equal(100m, _origen.Saldo);
    }
}

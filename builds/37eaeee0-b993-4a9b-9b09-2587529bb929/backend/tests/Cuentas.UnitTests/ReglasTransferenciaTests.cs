using Cuentas.Domain;
using Xunit;

namespace Cuentas.UnitTests;

public class ReglasTransferenciaTests
{
    private static readonly Guid Titular = Guid.NewGuid();

    private static Cuenta NuevaCuenta(decimal saldo, string moneda = "USD") =>
        new(Guid.NewGuid(), Titular, "****-0000", moneda, saldo);

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(10.123)]
    public void GivenMontoInvalido_WhenValidar_ThenRechaza(double monto)
    {
        var ex = Assert.Throws<ReglaNegocioException>(
            () => ReglasTransferencia.Validar(NuevaCuenta(100), NuevaCuenta(0), (decimal)monto, "USD"));
        Assert.Equal("monto_invalido", ex.Codigo);
    }

    [Fact]
    public void GivenSaldoInsuficiente_WhenValidar_ThenRechaza()
    {
        var ex = Assert.Throws<ReglaNegocioException>(
            () => ReglasTransferencia.Validar(NuevaCuenta(10), NuevaCuenta(0), 10.01m, "USD"));
        Assert.Equal("saldo_insuficiente", ex.Codigo);
    }

    [Fact]
    public void GivenMismaCuenta_WhenValidar_ThenRechaza()
    {
        var cuenta = NuevaCuenta(100);
        var ex = Assert.Throws<ReglaNegocioException>(
            () => ReglasTransferencia.Validar(cuenta, cuenta, 10m, "USD"));
        Assert.Equal("cuentas_iguales", ex.Codigo);
    }

    [Fact]
    public void GivenMonedasDistintas_WhenValidar_ThenRechaza()
    {
        var ex = Assert.Throws<ReglaNegocioException>(
            () => ReglasTransferencia.Validar(NuevaCuenta(100), NuevaCuenta(0, "EUR"), 10m, "USD"));
        Assert.Equal("moneda_distinta", ex.Codigo);
    }

    [Fact]
    public void GivenDatosValidos_WhenValidar_ThenNoLanza()
    {
        ReglasTransferencia.Validar(NuevaCuenta(100), NuevaCuenta(0), 100m, "USD");
    }

    [Fact]
    public void GivenConceptoLargo_WhenValidarConcepto_ThenRechaza()
    {
        var ex = Assert.Throws<ReglaNegocioException>(
            () => ReglasTransferencia.ValidarConcepto(new string('x', 141)));
        Assert.Equal("concepto_invalido", ex.Codigo);
    }

    [Fact]
    public void GivenSaldoInsuficiente_WhenDebitar_ThenNoModificaSaldo()
    {
        var cuenta = NuevaCuenta(5);
        Assert.Throws<ReglaNegocioException>(() => cuenta.Debitar(6m));
        Assert.Equal(5m, cuenta.Saldo);
    }
}

using Pagos.Application;
using Xunit;

namespace Pagos.UnitTests;

public class ConsultarPagosValidatorTests
{
    private static readonly DateTimeOffset Base = new(2026, 10, 1, 0, 0, 0, TimeSpan.Zero);

    [Fact]
    public void Given_consulta_por_defecto_When_valida_Then_no_hay_errores()
    {
        Assert.Empty(ConsultarPagosValidator.Validar(new ConsultarPagosQuery(null, null, null)));
    }

    [Fact]
    public void Given_rango_de_exactamente_90_dias_When_valida_Then_es_valido()
    {
        var query = new ConsultarPagosQuery(Base, Base.AddDays(90), null);

        Assert.Empty(ConsultarPagosValidator.Validar(query));
    }

    [Fact]
    public void Given_rango_de_91_dias_When_valida_Then_reporta_error()
    {
        var query = new ConsultarPagosQuery(Base, Base.AddDays(91), null);

        Assert.Single(ConsultarPagosValidator.Validar(query));
    }

    [Fact]
    public void Given_desde_posterior_a_hasta_When_valida_Then_reporta_error()
    {
        var query = new ConsultarPagosQuery(Base.AddDays(5), Base, null);

        Assert.Contains(ConsultarPagosValidator.Validar(query), e => e.Contains("desde"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(101)]
    public void Given_size_fuera_de_rango_When_valida_Then_reporta_error(int size)
    {
        var errores = ConsultarPagosValidator.Validar(new ConsultarPagosQuery(null, null, null, 1, size));

        Assert.Contains(errores, e => e.Contains("size"));
    }

    [Fact]
    public void Given_page_cero_When_valida_Then_reporta_error()
    {
        var errores = ConsultarPagosValidator.Validar(new ConsultarPagosQuery(null, null, null, 0, 20));

        Assert.Contains(errores, e => e.Contains("page"));
    }

    [Fact]
    public void Given_estado_desconocido_When_valida_Then_reporta_error()
    {
        var errores = ConsultarPagosValidator.Validar(new ConsultarPagosQuery(null, null, "DESCONOCIDO"));

        Assert.Contains(errores, e => e.Contains("estado"));
    }

    [Theory]
    [InlineData("0012345678", "****5678")]
    [InlineData("123", "***")]
    [InlineData("", "")]
    public void Given_cuenta_When_enmascara_Then_deja_visibles_solo_4_ultimos(string cuenta, string esperado)
    {
        Assert.Equal(esperado, PagoDto.EnmascararCuenta(cuenta));
    }
}

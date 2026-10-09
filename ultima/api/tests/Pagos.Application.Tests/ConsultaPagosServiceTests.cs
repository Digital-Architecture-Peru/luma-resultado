using Pagos.Application;
using Pagos.Domain;
using Pagos.Infrastructure;
using Xunit;

namespace Pagos.Application.Tests;

public sealed class ConsultaPagosServiceTests
{
    private static readonly Guid ClienteA = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private static readonly Guid ClienteB = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    private static readonly DateTimeOffset Ahora = new(2026, 10, 9, 12, 0, 0, TimeSpan.Zero);

    private sealed class RelojFijo : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => Ahora;
    }

    private static Pago NuevoPago(int n, Guid cliente, EstadoPago estado, int diasAtras, string cuenta = "00112233445566") =>
        new(Guid.Parse($"00000000-0000-0000-0000-{n:D12}"), cliente, $"REF-{n}", "Beneficiario Demo",
            cuenta, 10m * n, "USD", estado, Ahora.AddDays(-diasAtras));

    private static ConsultaPagosService CrearServicio(params Pago[] pagos) =>
        new(new InMemoryPagoRepository(pagos), new RelojFijo());

    [Fact]
    public async Task GivenDesdePosteriorAHasta_WhenListar_ThenLanzaConsultaInvalida()
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(ClienteA, Ahora, Ahora.AddDays(-1), null, 1, 10, CancellationToken.None));
    }

    [Fact]
    public async Task GivenRangoMayorA90Dias_WhenListar_ThenLanzaConsultaInvalida()
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(ClienteA, Ahora.AddDays(-91), Ahora, null, 1, 10, CancellationToken.None));
    }

    [Fact]
    public async Task GivenRangoDe90Dias_WhenListar_ThenEsValido()
    {
        var servicio = CrearServicio(NuevoPago(1, ClienteA, EstadoPago.Procesado, 89));

        var resultado = await servicio.ListarAsync(ClienteA, Ahora.AddDays(-90), Ahora, null, 1, 10, CancellationToken.None);

        Assert.Single(resultado.Items);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(51)]
    [InlineData(-3)]
    public async Task GivenPageSizeFueraDeRango_WhenListar_ThenLanzaConsultaInvalida(int pageSize)
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(ClienteA, null, null, null, 1, pageSize, CancellationToken.None));
    }

    [Fact]
    public async Task GivenPageCero_WhenListar_ThenLanzaConsultaInvalida()
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(ClienteA, null, null, null, 0, 10, CancellationToken.None));
    }

    [Fact]
    public async Task GivenEstadoDesconocido_WhenListar_ThenLanzaConsultaInvalida()
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(ClienteA, null, null, "INEXISTENTE", 1, 10, CancellationToken.None));
    }

    [Fact]
    public async Task GivenClienteVacio_WhenListar_ThenLanzaConsultaInvalida()
    {
        var servicio = CrearServicio();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ListarAsync(Guid.Empty, null, null, null, 1, 10, CancellationToken.None));
    }

    [Fact]
    public async Task GivenPagosDeVariosClientes_WhenListar_ThenSoloDevuelveLosDelCliente()
    {
        var servicio = CrearServicio(
            NuevoPago(1, ClienteA, EstadoPago.Procesado, 1),
            NuevoPago(2, ClienteB, EstadoPago.Procesado, 1));

        var resultado = await servicio.ListarAsync(ClienteA, null, null, null, 1, 10, CancellationToken.None);

        Assert.Equal(1, resultado.Total);
        Assert.Equal("REF-1", resultado.Items[0].Referencia);
    }

    [Fact]
    public async Task GivenPagoDeOtroCliente_WhenObtener_ThenDevuelveNull()
    {
        var pagoDeB = NuevoPago(2, ClienteB, EstadoPago.Procesado, 1);
        var servicio = CrearServicio(pagoDeB);

        var resultado = await servicio.ObtenerAsync(ClienteA, pagoDeB.Id, CancellationToken.None);

        Assert.Null(resultado);
    }

    [Fact]
    public async Task GivenPagoPropio_WhenObtener_ThenDevuelveDetalle()
    {
        var pago = NuevoPago(3, ClienteA, EstadoPago.Pendiente, 2);
        var servicio = CrearServicio(pago);

        var resultado = await servicio.ObtenerAsync(ClienteA, pago.Id, CancellationToken.None);

        Assert.NotNull(resultado);
        Assert.Equal("PENDIENTE", resultado!.Estado);
    }

    [Fact]
    public async Task GivenFiltroEstado_WhenListar_ThenSoloDevuelveEseEstado()
    {
        var servicio = CrearServicio(
            NuevoPago(1, ClienteA, EstadoPago.Procesado, 1),
            NuevoPago(2, ClienteA, EstadoPago.Rechazado, 2),
            NuevoPago(3, ClienteA, EstadoPago.Rechazado, 3));

        var resultado = await servicio.ListarAsync(ClienteA, null, null, "rechazado", 1, 10, CancellationToken.None);

        Assert.Equal(2, resultado.Total);
        Assert.All(resultado.Items, i => Assert.Equal("RECHAZADO", i.Estado));
    }

    [Fact]
    public async Task GivenVariasPaginas_WhenListar_ThenPaginaYOrdenaPorFechaDescendente()
    {
        var servicio = CrearServicio(
            NuevoPago(1, ClienteA, EstadoPago.Procesado, 5),
            NuevoPago(2, ClienteA, EstadoPago.Procesado, 1),
            NuevoPago(3, ClienteA, EstadoPago.Procesado, 3));

        var pagina1 = await servicio.ListarAsync(ClienteA, null, null, null, 1, 2, CancellationToken.None);
        var pagina2 = await servicio.ListarAsync(ClienteA, null, null, null, 2, 2, CancellationToken.None);

        Assert.Equal(3, pagina1.Total);
        Assert.Equal(new[] { "REF-2", "REF-3" }, pagina1.Items.Select(i => i.Referencia));
        Assert.Equal(new[] { "REF-1" }, pagina2.Items.Select(i => i.Referencia));
    }

    [Fact]
    public async Task GivenCuentaSinEnmascarar_WhenListar_ThenExponeSoloUltimos4()
    {
        var servicio = CrearServicio(NuevoPago(1, ClienteA, EstadoPago.Procesado, 1, "00112233445566"));

        var resultado = await servicio.ListarAsync(ClienteA, null, null, null, 1, 10, CancellationToken.None);

        Assert.Equal("****5566", resultado.Items[0].CuentaDestino);
    }

    [Theory]
    [InlineData("1234567890", "****7890")]
    [InlineData("****1234", "****1234")]
    [InlineData("12", "****12")]
    [InlineData("", "****")]
    public void GivenCuenta_WhenEnmascarar_ThenAplicaMascara(string entrada, string esperado)
    {
        Assert.Equal(esperado, CuentaMask.Enmascarar(entrada));
    }
}

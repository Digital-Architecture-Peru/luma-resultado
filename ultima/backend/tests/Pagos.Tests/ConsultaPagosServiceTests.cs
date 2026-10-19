using Pagos.Application;
using Pagos.Domain;
using Xunit;

namespace Pagos.Tests;

public class ConsultaPagosServiceTests
{
    private static readonly DateTimeOffset Ahora = new(2026, 6, 15, 12, 0, 0, TimeSpan.Zero);

    private sealed class RelojFijo : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => Ahora;
    }

    private sealed class RepositorioFalso : IPagosRepository
    {
        public FiltroPagos? UltimoFiltro { get; private set; }
        public List<Pago> Datos { get; } = new();

        public Task<ResultadoPaginado<Pago>> BuscarAsync(FiltroPagos filtro, CancellationToken ct)
        {
            UltimoFiltro = filtro;
            var items = Datos.Where(p => p.ClienteId == filtro.ClienteId).ToList();
            return Task.FromResult(new ResultadoPaginado<Pago>(items, items.Count, filtro.Page, filtro.PageSize));
        }

        public Task<Pago?> ObtenerPorIdAsync(string clienteId, Guid id, CancellationToken ct) =>
            Task.FromResult(Datos.FirstOrDefault(p => p.Id == id && p.ClienteId == clienteId));
    }

    private static Pago NuevoPago(string cliente = "CLI-0001", decimal monto = 1250.5m) => new(
        Guid.NewGuid(), cliente, "REF-001", "Beneficiario Ficticio", "****1234",
        monto, "PEN", EstadoPago.Aplicado, Ahora.AddDays(-2), "WEB");

    private static (ConsultaPagosService, RepositorioFalso) Crear()
    {
        var repo = new RepositorioFalso();
        return (new ConsultaPagosService(repo, new RelojFijo()), repo);
    }

    [Fact]
    public async Task GivenSinFiltros_WhenConsulta_ThenUsaVentanaDe30DiasYPaginaPorDefecto()
    {
        var (servicio, repo) = Crear();

        await servicio.ConsultarAsync("CLI-0001", null, null, null, null, null);

        Assert.Equal(Ahora, repo.UltimoFiltro!.Hasta);
        Assert.Equal(Ahora.AddDays(-30), repo.UltimoFiltro.Desde);
        Assert.Equal(1, repo.UltimoFiltro.Page);
        Assert.Equal(ConsultaPagosService.PageSizeDefault, repo.UltimoFiltro.PageSize);
    }

    [Fact]
    public async Task GivenMonto_WhenMapea_ThenSerializaComoTextoConDosDecimales()
    {
        var (servicio, repo) = Crear();
        repo.Datos.Add(NuevoPago(monto: 1250.5m));

        var resultado = await servicio.ConsultarAsync("CLI-0001", null, null, null, null, null);

        var dto = Assert.Single(resultado.Items);
        Assert.Equal("1250.50", dto.Monto);
        Assert.Equal("APLICADO", dto.Estado);
    }

    [Fact]
    public async Task GivenPagosDeOtroCliente_WhenConsulta_ThenNoLosDevuelve()
    {
        var (servicio, repo) = Crear();
        repo.Datos.Add(NuevoPago(cliente: "CLI-9999"));

        var resultado = await servicio.ConsultarAsync("CLI-0001", null, null, null, null, null);

        Assert.Empty(resultado.Items);
    }

    [Fact]
    public async Task GivenEstadoEnMinusculas_WhenConsulta_ThenLoNormaliza()
    {
        var (servicio, repo) = Crear();

        await servicio.ConsultarAsync("CLI-0001", null, null, "rechazado", null, null);

        Assert.Equal(EstadoPago.Rechazado, repo.UltimoFiltro!.Estado);
    }

    [Theory]
    [InlineData("DESCONOCIDO", null, null)]
    [InlineData(null, 0, null)]
    [InlineData(null, null, 0)]
    [InlineData(null, null, 51)]
    public async Task GivenParametrosInvalidos_WhenConsulta_ThenLanzaConsultaInvalida(string? estado, int? page, int? pageSize)
    {
        var (servicio, _) = Crear();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ConsultarAsync("CLI-0001", null, null, estado, page, pageSize));
    }

    [Fact]
    public async Task GivenDesdePosteriorAHasta_WhenConsulta_ThenLanzaConsultaInvalida()
    {
        var (servicio, _) = Crear();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ConsultarAsync("CLI-0001", Ahora, Ahora.AddDays(-1), null, null, null));
    }

    [Fact]
    public async Task GivenRangoMayorA12Meses_WhenConsulta_ThenLanzaConsultaInvalida()
    {
        var (servicio, _) = Crear();

        await Assert.ThrowsAsync<ConsultaInvalidaException>(() =>
            servicio.ConsultarAsync("CLI-0001", Ahora.AddDays(-400), Ahora, null, null, null));
    }

    [Fact]
    public async Task GivenIdDeOtroCliente_WhenObtiene_ThenDevuelveNulo()
    {
        var (servicio, repo) = Crear();
        var ajeno = NuevoPago(cliente: "CLI-9999");
        repo.Datos.Add(ajeno);

        Assert.Null(await servicio.ObtenerAsync("CLI-0001", ajeno.Id));
    }

    [Fact]
    public async Task GivenIdPropio_WhenObtiene_ThenDevuelveElPago()
    {
        var (servicio, repo) = Crear();
        var propio = NuevoPago();
        repo.Datos.Add(propio);

        var dto = await servicio.ObtenerAsync("CLI-0001", propio.Id);

        Assert.Equal(propio.Id, dto!.Id);
    }
}

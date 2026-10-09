using Cuentas.Application;
using Xunit;

namespace Cuentas.UnitTests;

public class ConsultarCuentasServiceTests
{
    private static readonly Guid ClienteA = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000001");
    private static readonly Guid ClienteB = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000002");

    private static Cuenta Nueva(Guid cliente, string numero) =>
        new(Guid.NewGuid(), cliente, numero, "AHORROS", "USD", 100.50m, "ACTIVA", DateTimeOffset.UnixEpoch);

    private sealed class RepositorioFalso : ICuentaRepository
    {
        private readonly List<Cuenta> _datos;
        public RepositorioFalso(params Cuenta[] datos) => _datos = datos.ToList();

        public Task<IReadOnlyList<Cuenta>> ListarPorClienteAsync(Guid clienteId, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<Cuenta>>(_datos.Where(c => c.ClienteId == clienteId).ToList());

        public Task<Cuenta?> ObtenerAsync(Guid clienteId, Guid cuentaId, CancellationToken ct) =>
            Task.FromResult(_datos.FirstOrDefault(c => c.Id == cuentaId && c.ClienteId == clienteId));
    }

    [Fact]
    public async Task GivenCuentasDeVariosClientes_WhenListar_ThenSoloDevuelveLasDelCliente()
    {
        var servicio = new ConsultarCuentasService(
            new RepositorioFalso(Nueva(ClienteA, "00100200300411"), Nueva(ClienteB, "00900800700144")));

        var resultado = await servicio.ListarAsync(ClienteA);

        Assert.Single(resultado);
        Assert.Equal("****0411", resultado[0].NumeroEnmascarado);
    }

    [Fact]
    public async Task GivenCuentaDeOtroCliente_WhenObtener_ThenDevuelveNull()
    {
        var ajena = Nueva(ClienteB, "00900800700144");
        var servicio = new ConsultarCuentasService(new RepositorioFalso(ajena));

        Assert.Null(await servicio.ObtenerAsync(ClienteA, ajena.Id));
    }

    [Fact]
    public async Task GivenCuentaPropia_WhenObtener_ThenDevuelveDtoConSaldo()
    {
        var propia = Nueva(ClienteA, "00100200300411");
        var servicio = new ConsultarCuentasService(new RepositorioFalso(propia));

        var dto = await servicio.ObtenerAsync(ClienteA, propia.Id);

        Assert.NotNull(dto);
        Assert.Equal(100.50m, dto!.Saldo);
    }

    [Theory]
    [InlineData("00100200300411", "****0411")]
    [InlineData("123", "****123")]
    [InlineData("", "****")]
    public void GivenNumero_WhenEnmascarar_ThenSoloMuestraUltimosCuatro(string numero, string esperado)
    {
        Assert.Equal(esperado, ConsultarCuentasService.Enmascarar(numero));
    }
}

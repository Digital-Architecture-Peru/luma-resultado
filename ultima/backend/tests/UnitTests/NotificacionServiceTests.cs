using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;
using Xunit;

namespace Tarjetas.Notificaciones.UnitTests;

internal sealed class FakeRepositorio : INotificacionRepository
{
    public List<Notificacion> Notificaciones { get; } = [];
    public List<Preferencia> Preferencias { get; } = [];

    public Task<(IReadOnlyList<Notificacion> Items, int Total)> ListarAsync(
        string clienteId, string tarjetaRef, bool? leida, int page, int size, CancellationToken ct)
    {
        var filtradas = Notificaciones
            .Where(n => n.ClienteId == clienteId && n.TarjetaRef == tarjetaRef && (leida is null || n.Leida == leida))
            .OrderByDescending(n => n.CreadaEn)
            .ToList();
        IReadOnlyList<Notificacion> pagina = filtradas.Skip((page - 1) * size).Take(size).ToList();
        return Task.FromResult((pagina, filtradas.Count));
    }

    public Task<bool> MarcarLeidaAsync(string clienteId, Guid id, CancellationToken ct)
    {
        var indice = Notificaciones.FindIndex(n => n.Id == id && n.ClienteId == clienteId);
        if (indice < 0) return Task.FromResult(false);
        Notificaciones[indice] = Notificaciones[indice] with { Leida = true };
        return Task.FromResult(true);
    }

    public Task<IReadOnlyList<Preferencia>> ObtenerPreferenciasAsync(
        string clienteId, string tarjetaRef, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<Preferencia>>(
            Preferencias.Where(p => p.ClienteId == clienteId && p.TarjetaRef == tarjetaRef).ToList());

    public Task GuardarPreferenciasAsync(
        string clienteId, string tarjetaRef, IReadOnlyList<Preferencia> preferencias, CancellationToken ct)
    {
        Preferencias.RemoveAll(p => p.ClienteId == clienteId && p.TarjetaRef == tarjetaRef);
        Preferencias.AddRange(preferencias);
        return Task.CompletedTask;
    }
}

public class NotificacionServiceTests
{
    private const string Cliente = "cliente-demo";
    private const string Tarjeta = "tok_demo_001";

    private static Notificacion Nueva(bool leida, int minutosAtras, string cliente = Cliente) => new(
        Guid.NewGuid(), cliente, Tarjeta, "4242", TipoNotificacion.Compra, "Compra", "Detalle",
        10m, "USD", leida, DateTimeOffset.UtcNow.AddMinutes(-minutosAtras));

    [Fact]
    public async Task Listar_DadoClienteConDatos_DevuelveSoloSusNotificacionesOrdenadas()
    {
        var repo = new FakeRepositorio();
        repo.Notificaciones.AddRange([Nueva(false, 30), Nueva(false, 5), Nueva(false, 1, "otro")]);
        var servicio = new NotificacionService(repo);

        var pagina = await servicio.ListarAsync(Cliente, Tarjeta, null, 1, 10);

        Assert.Equal(2, pagina.Total);
        Assert.True(pagina.Items[0].CreadaEn > pagina.Items[1].CreadaEn);
    }

    [Fact]
    public async Task Listar_ConFiltroLeida_DevuelveSoloLasNoLeidas()
    {
        var repo = new FakeRepositorio();
        repo.Notificaciones.AddRange([Nueva(true, 3), Nueva(false, 2)]);

        var pagina = await new NotificacionService(repo).ListarAsync(Cliente, Tarjeta, false, 1, 10);

        Assert.Single(pagina.Items);
        Assert.False(pagina.Items[0].Leida);
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(1, 0)]
    [InlineData(1, NotificacionService.TamanoMaximoPagina + 1)]
    public async Task Listar_ConPaginacionInvalida_LanzaValidacion(int page, int size)
    {
        var servicio = new NotificacionService(new FakeRepositorio());

        await Assert.ThrowsAsync<ValidacionException>(() => servicio.ListarAsync(Cliente, Tarjeta, null, page, size));
    }

    [Fact]
    public async Task Listar_SinClienteId_LanzaValidacion()
    {
        var servicio = new NotificacionService(new FakeRepositorio());

        await Assert.ThrowsAsync<ValidacionException>(() => servicio.ListarAsync(" ", Tarjeta, null, 1, 10));
    }

    [Fact]
    public async Task MarcarLeida_EsIdempotente()
    {
        var repo = new FakeRepositorio();
        var n = Nueva(false, 1);
        repo.Notificaciones.Add(n);
        var servicio = new NotificacionService(repo);

        await servicio.MarcarLeidaAsync(Cliente, n.Id);
        await servicio.MarcarLeidaAsync(Cliente, n.Id);

        Assert.True(repo.Notificaciones[0].Leida);
    }

    [Fact]
    public async Task MarcarLeida_DeOtroCliente_LanzaNoEncontrado()
    {
        var repo = new FakeRepositorio();
        var n = Nueva(false, 1, "otro");
        repo.Notificaciones.Add(n);

        await Assert.ThrowsAsync<NoEncontradoException>(
            () => new NotificacionService(repo).MarcarLeidaAsync(Cliente, n.Id));
    }

    [Fact]
    public async Task ObtenerPreferencias_SinGuardadas_DevuelveUnaPorTipoHabilitada()
    {
        var prefs = await new NotificacionService(new FakeRepositorio()).ObtenerPreferenciasAsync(Cliente, Tarjeta);

        Assert.Equal(Enum.GetValues<TipoNotificacion>().Length, prefs.Count);
        Assert.All(prefs, p => Assert.True(p.Habilitada));
    }

    [Fact]
    public async Task GuardarPreferencias_ConDatosValidos_LasPersisteConElClienteDeLaRuta()
    {
        var repo = new FakeRepositorio();
        var entrada = new List<Preferencia>
        {
            new("falso", "falso", TipoNotificacion.Pago, CanalNotificacion.Email, false, 20m)
        };

        await new NotificacionService(repo).GuardarPreferenciasAsync(Cliente, Tarjeta, entrada);

        var guardada = Assert.Single(repo.Preferencias);
        Assert.Equal(Cliente, guardada.ClienteId);
        Assert.Equal(Tarjeta, guardada.TarjetaRef);
        Assert.False(guardada.Habilitada);
    }

    [Fact]
    public async Task GuardarPreferencias_ConDuplicados_LanzaValidacion()
    {
        var p = new Preferencia(Cliente, Tarjeta, TipoNotificacion.Compra, CanalNotificacion.Web, true, null);

        await Assert.ThrowsAsync<ValidacionException>(
            () => new NotificacionService(new FakeRepositorio()).GuardarPreferenciasAsync(Cliente, Tarjeta, [p, p]));
    }

    [Fact]
    public async Task GuardarPreferencias_ConUmbralNegativo_LanzaValidacion()
    {
        var p = new Preferencia(Cliente, Tarjeta, TipoNotificacion.Compra, CanalNotificacion.Web, true, -1m);

        await Assert.ThrowsAsync<ValidacionException>(
            () => new NotificacionService(new FakeRepositorio()).GuardarPreferenciasAsync(Cliente, Tarjeta, [p]));
    }

    [Fact]
    public async Task GuardarPreferencias_SinElementos_LanzaValidacion()
    {
        await Assert.ThrowsAsync<ValidacionException>(
            () => new NotificacionService(new FakeRepositorio()).GuardarPreferenciasAsync(Cliente, Tarjeta, []));
    }
}

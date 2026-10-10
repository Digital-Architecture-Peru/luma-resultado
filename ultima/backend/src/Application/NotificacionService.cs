using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Application;

public sealed class NotificacionService(INotificacionRepository repositorio)
{
    public const int TamanoMaximoPagina = 50;

    public async Task<PaginaNotificaciones> ListarAsync(
        string clienteId, string tarjetaRef, bool? leida, int page, int size, CancellationToken ct = default)
    {
        ExigirTexto(clienteId, "cliente");
        ExigirTexto(tarjetaRef, "tarjetaRef");
        if (page < 1) throw new ValidacionException("page debe ser mayor o igual a 1.");
        if (size < 1 || size > TamanoMaximoPagina)
            throw new ValidacionException($"size debe estar entre 1 y {TamanoMaximoPagina}.");

        var (items, total) = await repositorio.ListarAsync(clienteId, tarjetaRef, leida, page, size, ct);
        return new PaginaNotificaciones(items, total, page, size);
    }

    /// <summary>Idempotente: marcar una notificación ya leída vuelve a tener éxito.</summary>
    public async Task MarcarLeidaAsync(string clienteId, Guid id, CancellationToken ct = default)
    {
        ExigirTexto(clienteId, "cliente");
        if (!await repositorio.MarcarLeidaAsync(clienteId, id, ct))
            throw new NoEncontradoException("Notificación no encontrada.");
    }

    public async Task<IReadOnlyList<Preferencia>> ObtenerPreferenciasAsync(
        string clienteId, string tarjetaRef, CancellationToken ct = default)
    {
        ExigirTexto(clienteId, "cliente");
        ExigirTexto(tarjetaRef, "tarjetaRef");
        var guardadas = await repositorio.ObtenerPreferenciasAsync(clienteId, tarjetaRef, ct);
        return guardadas.Count > 0 ? guardadas : PorDefecto(clienteId, tarjetaRef);
    }

    public async Task<IReadOnlyList<Preferencia>> GuardarPreferenciasAsync(
        string clienteId, string tarjetaRef, IReadOnlyList<Preferencia> preferencias, CancellationToken ct = default)
    {
        ExigirTexto(clienteId, "cliente");
        ExigirTexto(tarjetaRef, "tarjetaRef");
        if (preferencias.Count == 0) throw new ValidacionException("Se requiere al menos una preferencia.");

        var claves = new HashSet<(TipoNotificacion, CanalNotificacion)>();
        foreach (var p in preferencias)
        {
            if (p.UmbralMonto is < 0) throw new ValidacionException("umbralMonto no puede ser negativo.");
            if (!claves.Add((p.Tipo, p.Canal)))
                throw new ValidacionException($"Preferencia duplicada: {p.Tipo}/{p.Canal}.");
        }

        var normalizadas = preferencias
            .Select(p => p with { ClienteId = clienteId, TarjetaRef = tarjetaRef })
            .ToList();
        await repositorio.GuardarPreferenciasAsync(clienteId, tarjetaRef, normalizadas, ct);
        return normalizadas;
    }

    private static IReadOnlyList<Preferencia> PorDefecto(string clienteId, string tarjetaRef) =>
        Enum.GetValues<TipoNotificacion>()
            .Select(t => new Preferencia(clienteId, tarjetaRef, t, CanalNotificacion.Web, true, null))
            .ToList();

    private static void ExigirTexto(string valor, string nombre)
    {
        if (string.IsNullOrWhiteSpace(valor)) throw new ValidacionException($"{nombre} es obligatorio.");
    }
}

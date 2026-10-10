using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Api;

public sealed record NotificacionDto(
    Guid Id, string TarjetaRef, string Ultimos4, string Tipo, string Titulo, string Mensaje,
    decimal? Monto, string? Moneda, bool Leida, DateTimeOffset CreadaEn)
{
    public static NotificacionDto Desde(Notificacion n) => new(
        n.Id, n.TarjetaRef, n.Ultimos4, n.Tipo.ToString().ToUpperInvariant(), n.Titulo, n.Mensaje,
        n.Monto, n.Moneda, n.Leida, n.CreadaEn);
}

public sealed record PaginaDto(IReadOnlyList<NotificacionDto> Items, int Total, int Page, int Size);

public sealed record PreferenciaDto(string Tipo, string Canal, bool Habilitada, decimal? UmbralMonto)
{
    public static PreferenciaDto Desde(Preferencia p) => new(
        p.Tipo.ToString().ToUpperInvariant(), p.Canal.ToString().ToUpperInvariant(), p.Habilitada, p.UmbralMonto);

    public Preferencia ADominio(string clienteId, string tarjetaRef)
    {
        if (!Enum.TryParse<TipoNotificacion>(Tipo, true, out var tipo) || !Enum.IsDefined(tipo))
            throw new ValidacionException($"Tipo inválido: {Tipo}.");
        if (!Enum.TryParse<CanalNotificacion>(Canal, true, out var canal) || !Enum.IsDefined(canal))
            throw new ValidacionException($"Canal inválido: {Canal}.");
        return new Preferencia(clienteId, tarjetaRef, tipo, canal, Habilitada, UmbralMonto);
    }
}

public sealed record PreferenciasDto(List<PreferenciaDto>? Preferencias);

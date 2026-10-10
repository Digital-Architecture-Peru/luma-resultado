using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Application;

public sealed class ValidacionException(string message) : Exception(message);

public sealed class NoEncontradoException(string message) : Exception(message);

public sealed record PaginaNotificaciones(IReadOnlyList<Notificacion> Items, int Total, int Page, int Size);

/// <summary>Puerto de persistencia. Toda operación se acota por cliente.</summary>
public interface INotificacionRepository
{
    Task<(IReadOnlyList<Notificacion> Items, int Total)> ListarAsync(
        string clienteId, string tarjetaRef, bool? leida, int page, int size, CancellationToken ct);

    /// <returns>false si la notificación no existe para el cliente.</returns>
    Task<bool> MarcarLeidaAsync(string clienteId, Guid id, CancellationToken ct);

    Task<IReadOnlyList<Preferencia>> ObtenerPreferenciasAsync(
        string clienteId, string tarjetaRef, CancellationToken ct);

    Task GuardarPreferenciasAsync(
        string clienteId, string tarjetaRef, IReadOnlyList<Preferencia> preferencias, CancellationToken ct);
}

/// <summary>
/// Puerto para el envío real (email/SMS/push). Sin implementar: la integración no está definida.
/// </summary>
public interface INotificacionPublisher
{
    Task PublicarAsync(Notificacion notificacion, CancellationToken ct);
}

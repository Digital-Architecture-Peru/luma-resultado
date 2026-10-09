using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Application;

public interface INotificationRepository
{
    /// <returns>true si se insertó; false si el EventId ya existía (idempotencia).</returns>
    Task<bool> AddIfNewAsync(Notification notification, CancellationToken ct = default);

    Task<PagedResult<Notification>> ListAsync(
        string customerId, bool unreadOnly, int page, int pageSize, CancellationToken ct = default);

    /// <returns>false si la notificación no existe para ese cliente.</returns>
    Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct = default);

    Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct = default);

    Task SavePreferencesAsync(string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct = default);
}

/// <summary>Puerto de salida hacia canales (email, SMS, push). Integración real sin definir.</summary>
public interface INotificationDispatcher
{
    Task DispatchAsync(Notification notification, Channel channel, CancellationToken ct = default);
}

/// <summary>Identidad del cliente autenticado; la autenticación de la banca no está documentada.</summary>
public interface ICurrentCustomer
{
    string CustomerId { get; }
}

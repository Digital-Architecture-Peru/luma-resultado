using CardNotifications.Domain;

namespace CardNotifications.Application;

/// <summary>Persistencia de notificaciones y preferencias (implementada con PostgreSQL).</summary>
public interface INotificationRepository
{
    Task<IReadOnlyList<Notification>> ListAsync(string customerId, bool unreadOnly, int page, int size, CancellationToken ct);
    Task<int> CountUnreadAsync(string customerId, CancellationToken ct);
    Task AddAsync(Notification notification, CancellationToken ct);

    /// <returns>false si la notificación no existe para ese cliente. Es idempotente si ya estaba leída.</returns>
    Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct);
    Task<int> MarkAllReadAsync(string customerId, DateTimeOffset readAt, CancellationToken ct);

    Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct);
    Task SavePreferencesAsync(string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct);
}

/// <summary>Fuente de eventos de tarjeta. La integración real no está definida: solo hay implementación fake.</summary>
public interface ICardEventSource
{
    Task<IReadOnlyList<CardEvent>> PullAsync(CancellationToken ct);
}

/// <summary>Envío por canales externos al in-app (email, SMS, push). Solo hay implementación fake.</summary>
public interface IChannelDispatcher
{
    Task DispatchAsync(Channel channel, Notification notification, CancellationToken ct);
}

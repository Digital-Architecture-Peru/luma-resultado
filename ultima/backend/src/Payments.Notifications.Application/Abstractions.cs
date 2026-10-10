using Payments.Notifications.Domain;

namespace Payments.Notifications.Application;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int Size);

/// <summary>Puerto de persistencia de notificaciones.</summary>
public interface INotificationRepository
{
    Task<PagedResult<PaymentNotification>> ListAsync(
        string customerId, bool unreadOnly, int page, int size, CancellationToken ct);

    Task<int> CountUnreadAsync(string customerId, CancellationToken ct);

    Task<PaymentNotification?> FindAsync(string customerId, Guid id, CancellationToken ct);

    Task UpdateReadAsync(PaymentNotification notification, CancellationToken ct);
}

/// <summary>
/// Puerto hacia la integración de eventos de pago (contrato aún por definir).
/// </summary>
public interface INotificationSource
{
    IReadOnlyList<PaymentNotification> GetNotifications();
}

public sealed class NotificationNotFoundException(Guid id)
    : Exception($"No existe la notificación '{id}'.");

public sealed class InvalidRequestException(string message) : Exception(message);

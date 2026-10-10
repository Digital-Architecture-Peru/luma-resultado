using Notifications.Domain;

namespace Notifications.Application;

/// <summary>Puerto de persistencia (implementado con PostgreSQL en Infrastructure).</summary>
public interface INotificationRepository
{
    /// <returns>true si se insertó; false si ya existía (customer, payment_event).</returns>
    Task<bool> AddIfAbsentAsync(Notification notification, CancellationToken ct);

    Task<IReadOnlyList<Notification>> ListAsync(
        string customerId, NotificationStatus? status, int page, int size, CancellationToken ct);

    Task<int> CountUnreadAsync(string customerId, CancellationToken ct);

    Task<Notification?> MarkReadAsync(string customerId, Guid id, DateTimeOffset now, CancellationToken ct);
}

/// <summary>Canal de entrega. Hoy solo in-app; email/SMS/push son extensión futura (integración sin definir).</summary>
public interface INotificationChannel
{
    /// <returns>true si la notificación fue entregada por este canal.</returns>
    Task<bool> DeliverAsync(Notification notification, CancellationToken ct);
}

public sealed record PaymentEvent(string PaymentEventId, string Type, decimal Amount, string Currency, string Account);

public sealed record IngestResult(bool Created, NotificationDto Notification);

public sealed record NotificationDto(
    Guid Id, string Type, string Status, string Title, string Message,
    decimal Amount, string Currency, string MaskedAccount, DateTimeOffset CreatedAt, DateTimeOffset? ReadAt)
{
    public static NotificationDto From(Notification n) => new(
        n.Id, n.Type.ToCode(), n.Status.ToCode(), n.Title, n.Message,
        n.Amount, n.Currency, n.MaskedAccount, n.CreatedAt, n.ReadAt);
}

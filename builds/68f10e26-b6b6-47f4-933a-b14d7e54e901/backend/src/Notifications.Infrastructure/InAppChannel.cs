using Notifications.Application;
using Notifications.Domain;

namespace Notifications.Infrastructure;

/// <summary>Canal in-app: persiste la notificación para que la banca web la consulte. Idempotente por evento.</summary>
public sealed class InAppChannel : INotificationChannel
{
    private readonly INotificationRepository _repository;

    public InAppChannel(INotificationRepository repository) => _repository = repository;

    public Task<bool> DeliverAsync(Notification notification, CancellationToken ct) =>
        _repository.AddIfAbsentAsync(notification, ct);
}

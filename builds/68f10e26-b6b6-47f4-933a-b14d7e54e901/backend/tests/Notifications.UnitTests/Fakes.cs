using Notifications.Application;
using Notifications.Domain;

namespace Notifications.UnitTests;

public sealed class FakeClock : TimeProvider
{
    public DateTimeOffset Now { get; set; } = new(2026, 1, 15, 10, 0, 0, TimeSpan.Zero);
    public override DateTimeOffset GetUtcNow() => Now;
}

public sealed class InMemoryRepository : INotificationRepository
{
    public List<Notification> Items { get; } = new();

    public Task<bool> AddIfAbsentAsync(Notification n, CancellationToken ct)
    {
        if (Items.Any(i => i.CustomerId == n.CustomerId && i.PaymentEventId == n.PaymentEventId))
            return Task.FromResult(false);
        Items.Add(n);
        return Task.FromResult(true);
    }

    public Task<IReadOnlyList<Notification>> ListAsync(
        string customerId, NotificationStatus? status, int page, int size, CancellationToken ct)
    {
        IReadOnlyList<Notification> result = Items
            .Where(i => i.CustomerId == customerId && (status is null || i.Status == status))
            .OrderByDescending(i => i.CreatedAt)
            .Skip((page - 1) * size).Take(size).ToList();
        return Task.FromResult(result);
    }

    public Task<int> CountUnreadAsync(string customerId, CancellationToken ct) =>
        Task.FromResult(Items.Count(i => i.CustomerId == customerId && i.Status == NotificationStatus.Unread));

    public Task<Notification?> MarkReadAsync(string customerId, Guid id, DateTimeOffset now, CancellationToken ct)
    {
        var index = Items.FindIndex(i => i.Id == id && i.CustomerId == customerId);
        if (index < 0) return Task.FromResult<Notification?>(null);
        Items[index] = Items[index].MarkRead(now);
        return Task.FromResult<Notification?>(Items[index]);
    }
}

/// <summary>Canal de prueba equivalente al in-app: delega en el repositorio.</summary>
public sealed class RepositoryChannel : INotificationChannel
{
    private readonly INotificationRepository _repository;
    public RepositoryChannel(INotificationRepository repository) => _repository = repository;
    public Task<bool> DeliverAsync(Notification notification, CancellationToken ct) =>
        _repository.AddIfAbsentAsync(notification, ct);
}

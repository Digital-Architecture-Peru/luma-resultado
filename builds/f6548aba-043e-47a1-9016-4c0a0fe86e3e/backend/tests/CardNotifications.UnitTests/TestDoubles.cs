using CardNotifications.Application;
using CardNotifications.Domain;

namespace CardNotifications.UnitTests;

public sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => now;
}

public sealed class InMemoryNotificationRepository : INotificationRepository
{
    private readonly List<Notification> _items = new();
    private readonly Dictionary<string, List<Preference>> _preferences = new();

    public IReadOnlyList<Notification> All => _items;

    public Task<IReadOnlyList<Notification>> ListAsync(string customerId, bool unreadOnly, int page, int size, CancellationToken ct)
    {
        IReadOnlyList<Notification> result = _items
            .Where(n => n.CustomerId == customerId && (!unreadOnly || !n.IsRead))
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * size)
            .Take(size)
            .ToList();
        return Task.FromResult(result);
    }

    public Task<int> CountUnreadAsync(string customerId, CancellationToken ct) =>
        Task.FromResult(_items.Count(n => n.CustomerId == customerId && !n.IsRead));

    public Task AddAsync(Notification notification, CancellationToken ct)
    {
        _items.Add(notification);
        return Task.CompletedTask;
    }

    public Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct)
    {
        var index = _items.FindIndex(n => n.Id == id && n.CustomerId == customerId);
        if (index < 0) return Task.FromResult(false);
        _items[index] = _items[index] with { ReadAt = _items[index].ReadAt ?? readAt };
        return Task.FromResult(true);
    }

    public Task<int> MarkAllReadAsync(string customerId, DateTimeOffset readAt, CancellationToken ct)
    {
        var updated = 0;
        for (var i = 0; i < _items.Count; i++)
        {
            if (_items[i].CustomerId != customerId || _items[i].IsRead) continue;
            _items[i] = _items[i] with { ReadAt = readAt };
            updated++;
        }
        return Task.FromResult(updated);
    }

    public Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<Preference>>(
            _preferences.TryGetValue(customerId, out var list) ? list.ToList() : new List<Preference>());

    public Task SavePreferencesAsync(string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct)
    {
        _preferences[customerId] = preferences.ToList();
        return Task.CompletedTask;
    }
}

public sealed class StubCardEventSource(params CardEvent[] events) : ICardEventSource
{
    public Task<IReadOnlyList<CardEvent>> PullAsync(CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<CardEvent>>(events);
}

public sealed class RecordingDispatcher : IChannelDispatcher
{
    public List<(Channel Channel, Notification Notification)> Sent { get; } = new();

    public Task DispatchAsync(Channel channel, Notification notification, CancellationToken ct)
    {
        Sent.Add((channel, notification));
        return Task.CompletedTask;
    }
}

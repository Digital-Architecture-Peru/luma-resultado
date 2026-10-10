using Notifications.Application;
using Notifications.Domain;

namespace Notifications.UnitTests;

public sealed class InMemoryNotificationRepository : INotificationRepository
{
    public List<Notification> Items { get; } = [];
    public Dictionary<(string Account, NotificationType Type), bool> Preferences { get; } = [];

    public Task<IReadOnlyList<Notification>> ListAsync(string customerId, string accountId, bool unreadOnly, CancellationToken ct)
    {
        IReadOnlyList<Notification> result = Items
            .Where(n => n.CustomerId == customerId && n.AccountId == accountId && (!unreadOnly || !n.IsRead))
            .ToList();
        return Task.FromResult(result);
    }

    public Task<bool> MarkReadAsync(Guid id, string customerId, DateTimeOffset readAt, CancellationToken ct)
    {
        var index = Items.FindIndex(n => n.Id == id && n.CustomerId == customerId);
        if (index < 0)
        {
            return Task.FromResult(false);
        }

        Items[index] = Items[index].MarkRead(readAt);
        return Task.FromResult(true);
    }

    public Task<IReadOnlyList<NotificationPreference>> GetPreferencesAsync(string customerId, string accountId, CancellationToken ct)
    {
        IReadOnlyList<NotificationPreference> result = Preferences
            .Where(p => p.Key.Account == accountId)
            .Select(p => new NotificationPreference(p.Key.Type, p.Value))
            .ToList();
        return Task.FromResult(result);
    }

    public Task SavePreferencesAsync(string customerId, string accountId, IReadOnlyList<NotificationPreference> preferences, CancellationToken ct)
    {
        foreach (var p in preferences)
        {
            Preferences[(accountId, p.Type)] = p.Enabled;
        }

        return Task.CompletedTask;
    }
}

public sealed class FixedClock(DateTimeOffset now) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => now;
}

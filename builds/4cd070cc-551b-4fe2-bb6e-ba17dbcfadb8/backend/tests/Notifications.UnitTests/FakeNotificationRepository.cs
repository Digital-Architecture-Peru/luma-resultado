using Notifications.Application;
using Notifications.Domain;

namespace Notifications.UnitTests;

public sealed class FakeNotificationRepository : INotificationRepository
{
    public List<Notification> Store { get; } = new();
    public int SaveCalls { get; private set; }

    public Task<(IReadOnlyList<Notification> Items, int Total)> ListAsync(
        string customerId, string accountId, bool unreadOnly, int page, int pageSize, CancellationToken ct)
    {
        var all = Store
            .Where(n => n.CustomerId == customerId && n.AccountId == accountId && (!unreadOnly || !n.IsRead))
            .OrderByDescending(n => n.CreatedAt)
            .ToList();
        IReadOnlyList<Notification> items = all.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return Task.FromResult((items, all.Count));
    }

    public Task<int> CountUnreadAsync(string customerId, string accountId, CancellationToken ct) =>
        Task.FromResult(Store.Count(n => n.CustomerId == customerId && n.AccountId == accountId && !n.IsRead));

    public Task<Notification?> FindAsync(string customerId, Guid id, CancellationToken ct) =>
        Task.FromResult(Store.FirstOrDefault(n => n.Id == id && n.CustomerId == customerId));

    public Task SaveReadAsync(Notification notification, CancellationToken ct)
    {
        SaveCalls++;
        var index = Store.FindIndex(n => n.Id == notification.Id);
        Store[index] = notification;
        return Task.CompletedTask;
    }
}

using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

/// <summary>Repositorio en memoria para demo y pruebas (sin PostgreSQL).</summary>
public sealed class InMemoryNotificationRepository : INotificationRepository
{
    private readonly object _gate = new();
    private readonly List<Notification> _items = [];
    private readonly Dictionary<(string Customer, NotificationType Type, Channel Channel), bool> _prefs = [];

    public Task<bool> AddIfNewAsync(Notification notification, CancellationToken ct = default)
    {
        lock (_gate)
        {
            if (_items.Any(n => n.EventId == notification.EventId)) return Task.FromResult(false);
            _items.Add(notification);
            return Task.FromResult(true);
        }
    }

    public Task<PagedResult<Notification>> ListAsync(
        string customerId, bool unreadOnly, int page, int pageSize, CancellationToken ct = default)
    {
        lock (_gate)
        {
            var query = _items
                .Where(n => n.CustomerId == customerId && (!unreadOnly || !n.IsRead))
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Task.FromResult(new PagedResult<Notification>(items, page, pageSize, query.Count));
        }
    }

    public Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct = default)
    {
        lock (_gate)
        {
            var index = _items.FindIndex(n => n.Id == id && n.CustomerId == customerId);
            if (index < 0) return Task.FromResult(false);
            var current = _items[index];
            _items[index] = current with { ReadAt = current.ReadAt ?? readAt };
            return Task.FromResult(true);
        }
    }

    public Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct = default)
    {
        lock (_gate)
        {
            IReadOnlyList<Preference> result = _prefs
                .Where(kv => kv.Key.Customer == customerId)
                .Select(kv => new Preference(kv.Key.Type, kv.Key.Channel, kv.Value))
                .ToList();
            return Task.FromResult(result);
        }
    }

    public Task SavePreferencesAsync(
        string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct = default)
    {
        lock (_gate)
        {
            foreach (var p in preferences) _prefs[(customerId, p.Type, p.Channel)] = p.Enabled;
        }
        return Task.CompletedTask;
    }
}

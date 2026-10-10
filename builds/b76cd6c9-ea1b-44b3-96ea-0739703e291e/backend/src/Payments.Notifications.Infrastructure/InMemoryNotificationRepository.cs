using Payments.Notifications.Application;
using Payments.Notifications.Domain;

namespace Payments.Notifications.Infrastructure;

/// <summary>Repositorio en memoria para desarrollo y pruebas (sin base de datos).</summary>
public sealed class InMemoryNotificationRepository : INotificationRepository
{
    private readonly object _gate = new();
    private readonly List<PaymentNotification> _items;

    public InMemoryNotificationRepository(INotificationSource source)
    {
        _items = source.GetNotifications().ToList();
    }

    public Task<PagedResult<PaymentNotification>> ListAsync(
        string customerId, bool unreadOnly, int page, int size, CancellationToken ct)
    {
        lock (_gate)
        {
            var query = _items
                .Where(n => n.CustomerId == customerId && (!unreadOnly || !n.IsRead))
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
            var pageItems = query.Skip((page - 1) * size).Take(size).ToList();
            return Task.FromResult(new PagedResult<PaymentNotification>(pageItems, query.Count, page, size));
        }
    }

    public Task<int> CountUnreadAsync(string customerId, CancellationToken ct)
    {
        lock (_gate)
        {
            return Task.FromResult(_items.Count(n => n.CustomerId == customerId && !n.IsRead));
        }
    }

    public Task<PaymentNotification?> FindAsync(string customerId, Guid id, CancellationToken ct)
    {
        lock (_gate)
        {
            return Task.FromResult(_items.FirstOrDefault(n => n.CustomerId == customerId && n.Id == id));
        }
    }

    // La entidad ya es la misma instancia almacenada; no hay nada más que persistir.
    public Task UpdateReadAsync(PaymentNotification notification, CancellationToken ct) => Task.CompletedTask;
}

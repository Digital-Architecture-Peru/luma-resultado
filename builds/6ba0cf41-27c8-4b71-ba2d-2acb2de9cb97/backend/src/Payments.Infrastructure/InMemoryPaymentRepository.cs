using Payments.Application;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>Repositorio en memoria para pruebas y desarrollo sin base de datos.</summary>
public sealed class InMemoryPaymentRepository : IPaymentRepository
{
    private readonly object _gate = new();
    private readonly Dictionary<Guid, Payment> _items = new();

    public Task AddAsync(Payment payment, CancellationToken ct)
    {
        lock (_gate)
        {
            if (_items.Values.Any(p => p.IdempotencyKey == payment.IdempotencyKey))
                throw new DuplicateIdempotencyKeyException(payment.IdempotencyKey);
            _items[payment.Id] = payment;
        }
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Payment payment, CancellationToken ct)
    {
        lock (_gate) { _items[payment.Id] = payment; }
        return Task.CompletedTask;
    }

    public Task<Payment?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct)
    {
        lock (_gate)
            return Task.FromResult(_items.Values.FirstOrDefault(p => p.IdempotencyKey == idempotencyKey));
    }

    public Task<Payment?> GetByIdAsync(Guid id, string customerId, CancellationToken ct)
    {
        lock (_gate)
        {
            _items.TryGetValue(id, out var payment);
            return Task.FromResult(payment is not null && payment.CustomerId == customerId ? payment : null);
        }
    }

    public Task<IReadOnlyList<Payment>> ListByAccountAsync(string customerId, string accountId, CancellationToken ct)
    {
        lock (_gate)
        {
            IReadOnlyList<Payment> list = _items.Values
                .Where(p => p.CustomerId == customerId && p.SourceAccountId == accountId)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
            return Task.FromResult(list);
        }
    }
}

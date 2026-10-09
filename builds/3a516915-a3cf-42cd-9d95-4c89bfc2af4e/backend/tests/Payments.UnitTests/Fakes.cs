using Payments.Application;
using Payments.Domain;

namespace Payments.UnitTests;

internal sealed class InMemoryPaymentRepository : IPaymentRepository
{
    private readonly Dictionary<Guid, Account> _accounts = new();
    private readonly List<Payment> _payments = new();

    public int SaveCalls { get; private set; }

    public InMemoryPaymentRepository(params Account[] accounts)
    {
        foreach (var a in accounts) _accounts[a.Id] = a;
    }

    public Task<IReadOnlyList<Account>> ListAccountsAsync(CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<Account>>(_accounts.Values.ToList());

    public Task<Account?> FindAccountAsync(Guid id, CancellationToken ct) =>
        Task.FromResult(_accounts.GetValueOrDefault(id));

    public Task<Payment?> FindPaymentAsync(Guid id, CancellationToken ct) =>
        Task.FromResult(_payments.FirstOrDefault(p => p.Id == id));

    public Task<Payment?> FindByIdempotencyKeyAsync(string key, CancellationToken ct) =>
        Task.FromResult(_payments.FirstOrDefault(p => p.IdempotencyKey == key));

    public Task SaveAsync(Payment payment, CancellationToken ct)
    {
        SaveCalls++;
        _payments.Add(payment);
        return Task.CompletedTask;
    }
}

internal sealed class StubGateway : IPaymentGateway
{
    private readonly bool _approve;

    public StubGateway(bool approve) => _approve = approve;

    public Task<bool> AuthorizeAsync(Payment payment, CancellationToken ct) => Task.FromResult(_approve);
}

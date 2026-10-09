using Accounts.Domain;

namespace Accounts.Application;

public sealed record AccountPage(IReadOnlyList<Account> Items, int Total);

/// <summary>Puerto de lectura. Toda consulta se filtra por cliente (evita IDOR).</summary>
public interface IAccountRepository
{
    Task<AccountPage> ListByCustomerAsync(Guid customerId, int page, int size, CancellationToken ct);

    Task<Account?> FindAsync(Guid customerId, Guid accountId, CancellationToken ct);
}

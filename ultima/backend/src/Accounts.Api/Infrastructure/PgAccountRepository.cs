using Accounts.Application;
using Accounts.Domain;
using Dapper;
using Npgsql;

namespace Accounts.Infrastructure;

public sealed class PgAccountRepository(NpgsqlDataSource dataSource) : IAccountRepository
{
    private const string Columns = """
        id AS Id, customer_id AS CustomerId, account_number AS AccountNumber,
        product_type AS ProductType, currency AS Currency,
        available_balance AS AvailableBalance, ledger_balance AS LedgerBalance,
        status AS Status, opened_at AS OpenedAt, updated_at AS UpdatedAt
        """;

    public async Task<AccountPage> ListByCustomerAsync(Guid customerId, int page, int size, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);

        var listSql = $"SELECT {Columns} FROM accounts WHERE customer_id = @customerId " +
                      "ORDER BY opened_at DESC, id LIMIT @size OFFSET @offset";
        var rows = await conn.QueryAsync<AccountRow>(new CommandDefinition(
            listSql,
            new { customerId, size, offset = (page - 1) * size },
            cancellationToken: ct));

        var total = await conn.ExecuteScalarAsync<int>(new CommandDefinition(
            "SELECT COUNT(*) FROM accounts WHERE customer_id = @customerId",
            new { customerId },
            cancellationToken: ct));

        return new AccountPage(rows.Select(r => r.ToDomain()).ToList(), total);
    }

    public async Task<Account?> FindAsync(Guid customerId, Guid accountId, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);

        var sql = $"SELECT {Columns} FROM accounts WHERE id = @accountId AND customer_id = @customerId";
        var row = await conn.QuerySingleOrDefaultAsync<AccountRow>(new CommandDefinition(
            sql,
            new { accountId, customerId },
            cancellationToken: ct));

        return row?.ToDomain();
    }

    private sealed class AccountRow
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string AccountNumber { get; set; } = string.Empty;
        public string ProductType { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public decimal AvailableBalance { get; set; }
        public decimal LedgerBalance { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OpenedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Account ToDomain() => new(
            Id,
            CustomerId,
            AccountNumber,
            ProductType,
            Currency,
            AvailableBalance,
            LedgerBalance,
            Enum.Parse<AccountStatus>(Status, ignoreCase: true),
            new DateTimeOffset(DateTime.SpecifyKind(OpenedAt, DateTimeKind.Utc)),
            new DateTimeOffset(DateTime.SpecifyKind(UpdatedAt, DateTimeKind.Utc)));
    }
}

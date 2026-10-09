using Cuentas.Application;
using Cuentas.Domain;
using Npgsql;

namespace Cuentas.Infrastructure;

public sealed class NpgsqlAccountRepository : IAccountRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public NpgsqlAccountRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<IReadOnlyList<Account>> ListAsync(CancellationToken ct)
    {
        await using var cmd = _dataSource.CreateCommand(
            "SELECT id, number, holder, currency, balance FROM accounts ORDER BY id");
        await using var reader = await cmd.ExecuteReaderAsync(ct);

        var accounts = new List<Account>();
        while (await reader.ReadAsync(ct))
        {
            accounts.Add(AccountMapper.Read(reader));
        }

        return accounts;
    }

    public async Task<Account?> FindAsync(long id, CancellationToken ct)
    {
        await using var cmd = _dataSource.CreateCommand(
            "SELECT id, number, holder, currency, balance FROM accounts WHERE id = @id");
        cmd.Parameters.AddWithValue("id", id);
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        return await reader.ReadAsync(ct) ? AccountMapper.Read(reader) : null;
    }

    public async Task<IReadOnlyList<LedgerEntry>> ListEntriesAsync(long accountId, int limit, CancellationToken ct)
    {
        await using var cmd = _dataSource.CreateCommand(
            @"SELECT t.id, t.account_id, t.transfer_id, t.type, t.amount, tr.description, t.created_at
              FROM transactions t
              JOIN transfers tr ON tr.id = t.transfer_id
              WHERE t.account_id = @id
              ORDER BY t.created_at DESC, t.id DESC
              LIMIT @limit");
        cmd.Parameters.AddWithValue("id", accountId);
        cmd.Parameters.AddWithValue("limit", limit);
        await using var reader = await cmd.ExecuteReaderAsync(ct);

        var entries = new List<LedgerEntry>();
        while (await reader.ReadAsync(ct))
        {
            entries.Add(new LedgerEntry(
                reader.GetInt64(0),
                reader.GetInt64(1),
                reader.GetInt64(2),
                reader.GetString(3) == "DEBIT" ? EntryType.Debit : EntryType.Credit,
                reader.GetDecimal(4),
                reader.IsDBNull(5) ? null : reader.GetString(5),
                reader.GetFieldValue<DateTimeOffset>(6)));
        }

        return entries;
    }
}

internal static class AccountMapper
{
    public static Account Read(NpgsqlDataReader reader) =>
        new(reader.GetInt64(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetDecimal(4));
}

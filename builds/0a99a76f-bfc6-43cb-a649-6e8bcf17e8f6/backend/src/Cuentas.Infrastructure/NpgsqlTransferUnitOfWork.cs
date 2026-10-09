using Cuentas.Application;
using Cuentas.Domain;
using Npgsql;

namespace Cuentas.Infrastructure;

public sealed class NpgsqlTransferUnitOfWorkFactory : ITransferUnitOfWorkFactory
{
    private readonly NpgsqlDataSource _dataSource;

    public NpgsqlTransferUnitOfWorkFactory(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<ITransferUnitOfWork> BeginAsync(CancellationToken ct)
    {
        var connection = await _dataSource.OpenConnectionAsync(ct);
        var transaction = await connection.BeginTransactionAsync(ct);
        return new NpgsqlTransferUnitOfWork(connection, transaction);
    }
}

internal sealed class NpgsqlTransferUnitOfWork : ITransferUnitOfWork
{
    private const string UniqueViolation = "23505";
    private const string CompletedStatus = "COMPLETED";

    private readonly NpgsqlConnection _connection;
    private readonly NpgsqlTransaction _transaction;

    public NpgsqlTransferUnitOfWork(NpgsqlConnection connection, NpgsqlTransaction transaction)
    {
        _connection = connection;
        _transaction = transaction;
    }

    public async Task<TransferResult?> FindByKeyAsync(string idempotencyKey, CancellationToken ct)
    {
        await using var cmd = NewCommand(
            @"SELECT id, source_id, target_id, amount, status, created_at
              FROM transfers WHERE idempotency_key = @key");
        cmd.Parameters.AddWithValue("key", idempotencyKey);
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct))
        {
            return null;
        }

        return new TransferResult(
            reader.GetInt64(0), reader.GetInt64(1), reader.GetInt64(2),
            reader.GetDecimal(3), reader.GetString(4), reader.GetFieldValue<DateTimeOffset>(5));
    }

    public async Task<IReadOnlyList<Account>> LockAccountsAsync(IReadOnlyCollection<long> ascendingIds, CancellationToken ct)
    {
        await using var cmd = NewCommand(
            @"SELECT id, number, holder, currency, balance
              FROM accounts WHERE id = ANY(@ids) ORDER BY id FOR UPDATE");
        cmd.Parameters.AddWithValue("ids", ascendingIds.ToArray());
        await using var reader = await cmd.ExecuteReaderAsync(ct);

        var accounts = new List<Account>();
        while (await reader.ReadAsync(ct))
        {
            accounts.Add(AccountMapper.Read(reader));
        }

        return accounts;
    }

    public async Task<TransferResult> RecordTransferAsync(
        TransferCommand command, Account source, Account target, CancellationToken ct)
    {
        try
        {
            var (transferId, createdAt) = await InsertTransferAsync(command, ct);
            await UpdateBalanceAsync(source, ct);
            await UpdateBalanceAsync(target, ct);
            await InsertEntryAsync(source.Id, transferId, "DEBIT", command.Amount, ct);
            await InsertEntryAsync(target.Id, transferId, "CREDIT", command.Amount, ct);

            return new TransferResult(
                transferId, source.Id, target.Id, command.Amount, CompletedStatus, createdAt);
        }
        catch (PostgresException ex) when (ex.SqlState == UniqueViolation)
        {
            throw new DomainException(ErrorCodes.DuplicateRequest, "La solicitud ya fue procesada.");
        }
    }

    public Task CommitAsync(CancellationToken ct) => _transaction.CommitAsync(ct);

    public async ValueTask DisposeAsync()
    {
        await _transaction.DisposeAsync();
        await _connection.DisposeAsync();
    }

    private async Task<(long Id, DateTimeOffset CreatedAt)> InsertTransferAsync(TransferCommand c, CancellationToken ct)
    {
        await using var cmd = NewCommand(
            @"INSERT INTO transfers (idempotency_key, source_id, target_id, amount, description, status)
              VALUES (@key, @src, @tgt, @amount, @desc, @status)
              RETURNING id, created_at");
        cmd.Parameters.AddWithValue("key", c.IdempotencyKey);
        cmd.Parameters.AddWithValue("src", c.SourceAccountId);
        cmd.Parameters.AddWithValue("tgt", c.TargetAccountId);
        cmd.Parameters.AddWithValue("amount", c.Amount);
        cmd.Parameters.AddWithValue("desc", (object?)c.Description ?? DBNull.Value);
        cmd.Parameters.AddWithValue("status", CompletedStatus);
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        await reader.ReadAsync(ct);
        return (reader.GetInt64(0), reader.GetFieldValue<DateTimeOffset>(1));
    }

    private async Task UpdateBalanceAsync(Account account, CancellationToken ct)
    {
        await using var cmd = NewCommand("UPDATE accounts SET balance = @balance WHERE id = @id");
        cmd.Parameters.AddWithValue("balance", account.Balance);
        cmd.Parameters.AddWithValue("id", account.Id);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private async Task InsertEntryAsync(long accountId, long transferId, string type, decimal amount, CancellationToken ct)
    {
        await using var cmd = NewCommand(
            @"INSERT INTO transactions (account_id, transfer_id, type, amount)
              VALUES (@account, @transfer, @type, @amount)");
        cmd.Parameters.AddWithValue("account", accountId);
        cmd.Parameters.AddWithValue("transfer", transferId);
        cmd.Parameters.AddWithValue("type", type);
        cmd.Parameters.AddWithValue("amount", amount);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private NpgsqlCommand NewCommand(string sql) => new(sql, _connection, _transaction);
}

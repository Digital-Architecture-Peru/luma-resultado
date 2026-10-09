using Dapper;
using Npgsql;
using Payments.Application;
using Payments.Domain;

namespace Payments.Infrastructure;

public sealed class PaymentRepository : IPaymentRepository
{
    private const string AccountColumns =
        "id AS \"Id\", number AS \"Number\", holder AS \"Holder\", currency AS \"Currency\", balance AS \"Balance\"";

    private const string PaymentColumns =
        "id AS \"Id\", idempotency_key AS \"IdempotencyKey\", source_account_id AS \"SourceAccountId\", " +
        "beneficiary_account AS \"BeneficiaryAccount\", amount AS \"Amount\", currency AS \"Currency\", " +
        "status AS \"Status\", reference AS \"Reference\", created_at AS \"CreatedAt\"";

    private const string DebitSql =
        "UPDATE accounts SET balance = balance - @Amount WHERE id = @Id AND balance >= @Amount";

    private const string InsertSql =
        "INSERT INTO payments (id, idempotency_key, source_account_id, beneficiary_account, amount, currency, status, reference, created_at) " +
        "VALUES (@Id, @IdempotencyKey, @SourceAccountId, @BeneficiaryAccount, @Amount, @Currency, @Status, @Reference, @CreatedAt)";

    private readonly NpgsqlDataSource _dataSource;

    public PaymentRepository(NpgsqlDataSource dataSource) => _dataSource = dataSource;

    public async Task<IReadOnlyList<Account>> ListAccountsAsync(CancellationToken ct)
    {
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<AccountRow>(
            new CommandDefinition($"SELECT {AccountColumns} FROM accounts ORDER BY number", cancellationToken: ct));
        return rows.Select(r => r.ToDomain()).ToList();
    }

    public async Task<Account?> FindAccountAsync(Guid id, CancellationToken ct)
    {
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<AccountRow>(
            new CommandDefinition($"SELECT {AccountColumns} FROM accounts WHERE id = @Id", new { Id = id }, cancellationToken: ct));
        return row?.ToDomain();
    }

    public Task<Payment?> FindPaymentAsync(Guid id, CancellationToken ct) =>
        FindPaymentAsync("id = @P", id, ct);

    public Task<Payment?> FindByIdempotencyKeyAsync(string key, CancellationToken ct) =>
        FindPaymentAsync("idempotency_key = @P", key, ct);

    public async Task SaveAsync(Payment payment, CancellationToken ct)
    {
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        await using var tx = await conn.BeginTransactionAsync(ct);
        try
        {
            if (payment.Status == PaymentStatus.Completed) await DebitAsync(conn, tx, payment, ct);
            await conn.ExecuteAsync(new CommandDefinition(InsertSql, ToParameters(payment), tx, cancellationToken: ct));
            await tx.CommitAsync(ct);
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            throw new IdempotencyConflictException(payment.IdempotencyKey);
        }
    }

    // UPDATE condicional atómico: evita saldo negativo bajo concurrencia sin bloqueos explícitos.
    private static async Task DebitAsync(NpgsqlConnection conn, NpgsqlTransaction tx, Payment payment, CancellationToken ct)
    {
        var rows = await conn.ExecuteAsync(new CommandDefinition(
            DebitSql, new { Amount = payment.Amount, Id = payment.SourceAccountId }, tx, cancellationToken: ct));
        if (rows == 0) throw new DomainException("Saldo insuficiente.");
    }

    private async Task<Payment?> FindPaymentAsync(string where, object parameter, CancellationToken ct)
    {
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<PaymentRow>(new CommandDefinition(
            $"SELECT {PaymentColumns} FROM payments WHERE {where}", new { P = parameter }, cancellationToken: ct));
        return row?.ToDomain();
    }

    private static object ToParameters(Payment p) => new
    {
        p.Id,
        p.IdempotencyKey,
        p.SourceAccountId,
        p.BeneficiaryAccount,
        p.Amount,
        p.Currency,
        Status = p.Status.ToString().ToUpperInvariant(),
        p.Reference,
        CreatedAt = p.CreatedAt.UtcDateTime,
    };

    private sealed class AccountRow
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = "";
        public string Holder { get; set; } = "";
        public string Currency { get; set; } = "";
        public decimal Balance { get; set; }

        public Account ToDomain() => new(Id, Number, Holder, Currency, Balance);
    }

    private sealed class PaymentRow
    {
        public Guid Id { get; set; }
        public string IdempotencyKey { get; set; } = "";
        public Guid SourceAccountId { get; set; }
        public string BeneficiaryAccount { get; set; } = "";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "";
        public string Status { get; set; } = "";
        public string Reference { get; set; } = "";
        public DateTime CreatedAt { get; set; }

        public Payment ToDomain() => Payment.Rehydrate(new PaymentSnapshot(
            Id, IdempotencyKey, SourceAccountId, BeneficiaryAccount, Amount, Currency,
            Enum.Parse<PaymentStatus>(Status, ignoreCase: true), Reference,
            new DateTimeOffset(DateTime.SpecifyKind(CreatedAt, DateTimeKind.Utc))));
    }
}

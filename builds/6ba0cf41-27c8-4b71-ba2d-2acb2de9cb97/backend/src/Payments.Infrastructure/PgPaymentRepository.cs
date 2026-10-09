using Dapper;
using Npgsql;
using Payments.Application;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>Repositorio PostgreSQL (Npgsql + Dapper). Todas las consultas son parametrizadas.</summary>
public sealed class PgPaymentRepository : IPaymentRepository
{
    private const string UniqueViolation = "23505";

    private const string Columns =
        "id, customer_id, source_account_id, beneficiary_account, amount, currency, concept, " +
        "status, failure_reason, idempotency_key, created_at, processed_at";

    private readonly NpgsqlDataSource _dataSource;

    static PgPaymentRepository()
    {
        DefaultTypeMap.MatchNamesWithUnderscores = true;
    }

    public PgPaymentRepository(NpgsqlDataSource dataSource) => _dataSource = dataSource;

    public async Task AddAsync(Payment p, CancellationToken ct)
    {
        const string sql =
            "INSERT INTO payments (" + Columns + ") VALUES (" +
            "@Id, @CustomerId, @SourceAccountId, @BeneficiaryAccount, @Amount, @Currency, @Concept, " +
            "@Status, @FailureReason, @IdempotencyKey, @CreatedAt, @ProcessedAt)";
        try
        {
            await using var conn = await _dataSource.OpenConnectionAsync(ct);
            await conn.ExecuteAsync(new CommandDefinition(sql, ToParameters(p), cancellationToken: ct));
        }
        catch (PostgresException ex) when (ex.SqlState == UniqueViolation)
        {
            throw new DuplicateIdempotencyKeyException(p.IdempotencyKey);
        }
    }

    public async Task UpdateAsync(Payment p, CancellationToken ct)
    {
        const string sql =
            "UPDATE payments SET status = @Status, failure_reason = @FailureReason, processed_at = @ProcessedAt " +
            "WHERE id = @Id";
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        await conn.ExecuteAsync(new CommandDefinition(sql, ToParameters(p), cancellationToken: ct));
    }

    public async Task<Payment?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct)
    {
        const string sql = "SELECT " + Columns + " FROM payments WHERE idempotency_key = @Key";
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<PaymentRow>(
            new CommandDefinition(sql, new { Key = idempotencyKey }, cancellationToken: ct));
        return row?.ToDomain();
    }

    public async Task<Payment?> GetByIdAsync(Guid id, string customerId, CancellationToken ct)
    {
        const string sql = "SELECT " + Columns + " FROM payments WHERE id = @Id AND customer_id = @CustomerId";
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<PaymentRow>(
            new CommandDefinition(sql, new { Id = id, CustomerId = customerId }, cancellationToken: ct));
        return row?.ToDomain();
    }

    public async Task<IReadOnlyList<Payment>> ListByAccountAsync(string customerId, string accountId, CancellationToken ct)
    {
        const string sql =
            "SELECT " + Columns + " FROM payments " +
            "WHERE customer_id = @CustomerId AND source_account_id = @AccountId " +
            "ORDER BY created_at DESC LIMIT 100";
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<PaymentRow>(
            new CommandDefinition(sql, new { CustomerId = customerId, AccountId = accountId }, cancellationToken: ct));
        return rows.Select(r => r.ToDomain()).ToList();
    }

    private static object ToParameters(Payment p) => new
    {
        p.Id,
        p.CustomerId,
        p.SourceAccountId,
        p.BeneficiaryAccount,
        p.Amount,
        p.Currency,
        p.Concept,
        Status = p.Status.ToString().ToUpperInvariant(),
        p.FailureReason,
        p.IdempotencyKey,
        CreatedAt = p.CreatedAt.UtcDateTime,
        ProcessedAt = p.ProcessedAt?.UtcDateTime
    };

    private sealed class PaymentRow
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string SourceAccountId { get; set; } = "";
        public string BeneficiaryAccount { get; set; } = "";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "";
        public string Concept { get; set; } = "";
        public string Status { get; set; } = "";
        public string? FailureReason { get; set; }
        public string IdempotencyKey { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }

        public Payment ToDomain() => Payment.Restore(
            Id, CustomerId, SourceAccountId, BeneficiaryAccount, Amount, Currency, Concept,
            Enum.Parse<PaymentStatus>(Status, ignoreCase: true), FailureReason, IdempotencyKey,
            new DateTimeOffset(DateTime.SpecifyKind(CreatedAt, DateTimeKind.Utc)),
            ProcessedAt.HasValue
                ? new DateTimeOffset(DateTime.SpecifyKind(ProcessedAt.Value, DateTimeKind.Utc))
                : null);
    }
}

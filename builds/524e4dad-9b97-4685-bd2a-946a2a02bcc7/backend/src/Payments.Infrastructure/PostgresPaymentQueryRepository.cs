using System.Text;
using Dapper;
using Npgsql;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>Lectura sobre PostgreSQL con SQL parametrizado. Siempre filtra por customer_id.</summary>
public sealed class PostgresPaymentQueryRepository : IPaymentQueryRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, beneficiary AS Beneficiary, account_masked AS AccountMasked, " +
        "amount AS Amount, currency AS Currency, status AS Status, paid_at AS PaidAt, reference AS Reference";

    private readonly NpgsqlDataSource _dataSource;

    public PostgresPaymentQueryRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<PagedResult<Payment>> SearchAsync(Guid customerId, PaymentFilter filter, CancellationToken ct)
    {
        var where = new StringBuilder("customer_id = @customerId");
        var args = new DynamicParameters();
        args.Add("customerId", customerId);

        if (filter.From.HasValue)
        {
            where.Append(" AND paid_at >= @from");
            args.Add("from", filter.From.Value.ToUniversalTime().UtcDateTime);
        }
        if (filter.To.HasValue)
        {
            where.Append(" AND paid_at <= @to");
            args.Add("to", filter.To.Value.ToUniversalTime().UtcDateTime);
        }
        if (filter.Status.HasValue)
        {
            where.Append(" AND status = @status");
            args.Add("status", filter.Status.Value.ToString().ToUpperInvariant());
        }

        await using var conn = await _dataSource.OpenConnectionAsync(ct);

        var total = await conn.ExecuteScalarAsync<int>(
            new CommandDefinition($"SELECT COUNT(*) FROM payments WHERE {where}", args, cancellationToken: ct));

        args.Add("limit", filter.PageSize);
        args.Add("offset", (filter.Page - 1) * filter.PageSize);
        var rows = await conn.QueryAsync<PaymentRow>(new CommandDefinition(
            $"SELECT {Columns} FROM payments WHERE {where} ORDER BY paid_at DESC, id LIMIT @limit OFFSET @offset",
            args, cancellationToken: ct));

        var items = rows.Select(ToDomain).ToList();
        return new PagedResult<Payment>(items, filter.Page, filter.PageSize, total);
    }

    public async Task<Payment?> FindByIdAsync(Guid customerId, Guid id, CancellationToken ct)
    {
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<PaymentRow>(new CommandDefinition(
            $"SELECT {Columns} FROM payments WHERE customer_id = @customerId AND id = @id",
            new { customerId, id }, cancellationToken: ct));
        return row is null ? null : ToDomain(row);
    }

    private static Payment ToDomain(PaymentRow r) => new(
        r.Id,
        r.CustomerId,
        r.Beneficiary,
        r.AccountMasked,
        r.Amount,
        r.Currency.Trim(),
        Enum.Parse<PaymentStatus>(r.Status, ignoreCase: true),
        new DateTimeOffset(DateTime.SpecifyKind(r.PaidAt, DateTimeKind.Utc)),
        r.Reference);

    private sealed class PaymentRow
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Beneficiary { get; set; } = "";
        public string AccountMasked { get; set; } = "";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "";
        public string Status { get; set; } = "";
        public DateTime PaidAt { get; set; }
        public string Reference { get; set; } = "";
    }
}

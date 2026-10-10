using Dapper;
using Notifications.Application;
using Notifications.Domain;
using Npgsql;

namespace Notifications.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL explícito y parámetros (sin concatenar valores).</summary>
public sealed class PgNotificationRepository : INotificationRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, payment_event_id AS PaymentEventId, type AS Type, status AS Status, " +
        "title AS Title, message AS Message, amount AS Amount, currency AS Currency, " +
        "masked_account AS MaskedAccount, created_at AS CreatedAt, read_at AS ReadAt";

    private readonly NpgsqlDataSource _dataSource;

    public PgNotificationRepository(NpgsqlDataSource dataSource) => _dataSource = dataSource;

    public async Task<bool> AddIfAbsentAsync(Notification n, CancellationToken ct)
    {
        const string sql = @"
INSERT INTO notification (id, customer_id, payment_event_id, type, status, title, message,
                          amount, currency, masked_account, created_at, read_at)
VALUES (@Id, @CustomerId, @PaymentEventId, @Type, @Status, @Title, @Message,
        @Amount, @Currency, @MaskedAccount, @CreatedAt, @ReadAt)
ON CONFLICT (customer_id, payment_event_id) DO NOTHING";

        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var rows = await conn.ExecuteAsync(new CommandDefinition(sql, new
        {
            n.Id, n.CustomerId, n.PaymentEventId,
            Type = n.Type.ToCode(), Status = n.Status.ToCode(),
            n.Title, n.Message, n.Amount, n.Currency, n.MaskedAccount,
            CreatedAt = n.CreatedAt.UtcDateTime,
            ReadAt = n.ReadAt?.UtcDateTime,
        }, cancellationToken: ct));
        return rows > 0;
    }

    public async Task<IReadOnlyList<Notification>> ListAsync(
        string customerId, NotificationStatus? status, int page, int size, CancellationToken ct)
    {
        var sql = $@"
SELECT {Columns} FROM notification
WHERE customer_id = @CustomerId AND (@Status::text IS NULL OR status = @Status)
ORDER BY created_at DESC
LIMIT @Size OFFSET @Offset";

        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<Row>(new CommandDefinition(sql, new
        {
            CustomerId = customerId,
            Status = status?.ToCode(),
            Size = size,
            Offset = (page - 1) * size,
        }, cancellationToken: ct));
        return rows.Select(r => r.ToDomain()).ToList();
    }

    public async Task<int> CountUnreadAsync(string customerId, CancellationToken ct)
    {
        const string sql = "SELECT COUNT(*) FROM notification WHERE customer_id = @CustomerId AND status = 'UNREAD'";
        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        return await conn.ExecuteScalarAsync<int>(new CommandDefinition(sql, new { CustomerId = customerId }, cancellationToken: ct));
    }

    public async Task<Notification?> MarkReadAsync(string customerId, Guid id, DateTimeOffset now, CancellationToken ct)
    {
        var sql = $@"
UPDATE notification
SET status = 'READ', read_at = COALESCE(read_at, @Now)
WHERE id = @Id AND customer_id = @CustomerId
RETURNING {Columns}";

        await using var conn = await _dataSource.OpenConnectionAsync(ct);
        var row = await conn.QuerySingleOrDefaultAsync<Row>(new CommandDefinition(
            sql, new { Id = id, CustomerId = customerId, Now = now.UtcDateTime }, cancellationToken: ct));
        return row?.ToDomain();
    }

    private sealed class Row
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string PaymentEventId { get; set; } = "";
        public string Type { get; set; } = "";
        public string Status { get; set; } = "";
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "";
        public string MaskedAccount { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }

        public Notification ToDomain()
        {
            if (!NotificationCodes.TryParseType(Type, out var type) || !NotificationCodes.TryParseStatus(Status, out var status))
                throw new InvalidOperationException("Fila de notificación con tipo o estado desconocido.");
            return new Notification(Id, CustomerId, PaymentEventId, type, status, Title, Message, Amount, Currency,
                MaskedAccount, new DateTimeOffset(DateTime.SpecifyKind(CreatedAt, DateTimeKind.Utc)),
                ReadAt is null ? null : new DateTimeOffset(DateTime.SpecifyKind(ReadAt.Value, DateTimeKind.Utc)));
        }
    }
}

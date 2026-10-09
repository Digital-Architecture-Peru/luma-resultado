using Dapper;
using Npgsql;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

/// <summary>Acceso a PostgreSQL con Dapper. Todas las consultas están parametrizadas.</summary>
public sealed class PostgresNotificationRepository(NpgsqlDataSource dataSource) : INotificationRepository
{
    private const string InsertSql = """
        INSERT INTO notification (id, customer_id, card_ref, card_last4, type, title, body, event_id, created_at, read_at)
        VALUES (@Id, @CustomerId, @CardRef, @CardLast4, @Type, @Title, @Body, @EventId, @CreatedAt, NULL)
        ON CONFLICT (event_id) DO NOTHING
        """;

    private const string ListSql = """
        SELECT id AS Id, customer_id AS CustomerId, card_ref AS CardRef, card_last4 AS CardLast4,
               type AS Type, title AS Title, body AS Body, event_id AS EventId,
               created_at AS CreatedAt, read_at AS ReadAt
        FROM notification
        WHERE customer_id = @CustomerId AND (@UnreadOnly = FALSE OR read_at IS NULL)
        ORDER BY created_at DESC
        LIMIT @PageSize OFFSET @Offset
        """;

    private const string CountSql = """
        SELECT COUNT(*) FROM notification
        WHERE customer_id = @CustomerId AND (@UnreadOnly = FALSE OR read_at IS NULL)
        """;

    private const string MarkReadSql = """
        UPDATE notification SET read_at = COALESCE(read_at, @ReadAt)
        WHERE id = @Id AND customer_id = @CustomerId
        """;

    private const string GetPrefsSql = """
        SELECT type AS Type, channel AS Channel, enabled AS Enabled
        FROM notification_preference WHERE customer_id = @CustomerId
        """;

    private const string UpsertPrefSql = """
        INSERT INTO notification_preference (customer_id, type, channel, enabled)
        VALUES (@CustomerId, @Type, @Channel, @Enabled)
        ON CONFLICT (customer_id, type, channel) DO UPDATE SET enabled = EXCLUDED.enabled
        """;

    public async Task<bool> AddIfNewAsync(Notification n, CancellationToken ct = default)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var rows = await conn.ExecuteAsync(new CommandDefinition(InsertSql, new
        {
            n.Id,
            n.CustomerId,
            n.CardRef,
            n.CardLast4,
            Type = DbCodes.ToDb(n.Type),
            n.Title,
            n.Body,
            n.EventId,
            CreatedAt = n.CreatedAt.UtcDateTime
        }, cancellationToken: ct));
        return rows > 0;
    }

    public async Task<PagedResult<Notification>> ListAsync(
        string customerId, bool unreadOnly, int page, int pageSize, CancellationToken ct = default)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var args = new { CustomerId = customerId, UnreadOnly = unreadOnly, PageSize = pageSize, Offset = (page - 1) * pageSize };
        var rows = (await conn.QueryAsync<NotificationRow>(new CommandDefinition(ListSql, args, cancellationToken: ct))).ToList();
        var total = await conn.ExecuteScalarAsync<int>(new CommandDefinition(CountSql, args, cancellationToken: ct));
        return new PagedResult<Notification>(rows.Select(ToDomain).ToList(), page, pageSize, total);
    }

    public async Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct = default)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var rows = await conn.ExecuteAsync(new CommandDefinition(
            MarkReadSql, new { Id = id, CustomerId = customerId, ReadAt = readAt.UtcDateTime }, cancellationToken: ct));
        return rows > 0;
    }

    public async Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct = default)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<PreferenceRow>(
            new CommandDefinition(GetPrefsSql, new { CustomerId = customerId }, cancellationToken: ct));
        return rows.Select(r => new Preference(DbCodes.TypeFromDb(r.Type), DbCodes.ChannelFromDb(r.Channel), r.Enabled)).ToList();
    }

    public async Task SavePreferencesAsync(
        string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct = default)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        await using var tx = await conn.BeginTransactionAsync(ct);
        foreach (var p in preferences)
        {
            await conn.ExecuteAsync(new CommandDefinition(UpsertPrefSql, new
            {
                CustomerId = customerId,
                Type = DbCodes.ToDb(p.Type),
                Channel = DbCodes.ToDb(p.Channel),
                p.Enabled
            }, tx, cancellationToken: ct));
        }
        await tx.CommitAsync(ct);
    }

    private static Notification ToDomain(NotificationRow r) => new(
        r.Id, r.CustomerId, r.CardRef, r.CardLast4, DbCodes.TypeFromDb(r.Type), r.Title, r.Body, r.EventId,
        new DateTimeOffset(DateTime.SpecifyKind(r.CreatedAt, DateTimeKind.Utc)),
        r.ReadAt is null ? null : new DateTimeOffset(DateTime.SpecifyKind(r.ReadAt.Value, DateTimeKind.Utc)));

    private sealed class NotificationRow
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string CardRef { get; set; } = "";
        public string CardLast4 { get; set; } = "";
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Body { get; set; } = "";
        public string EventId { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    private sealed class PreferenceRow
    {
        public string Type { get; set; } = "";
        public string Channel { get; set; } = "";
        public bool Enabled { get; set; }
    }
}

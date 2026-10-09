using CardNotifications.Application;
using CardNotifications.Domain;
using Dapper;
using Npgsql;

namespace CardNotifications.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL parametrizado (Dapper). Fechas en UTC (timestamptz).</summary>
public sealed class PgNotificationRepository(NpgsqlDataSource dataSource) : INotificationRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, card_ref AS CardRef, card_last4 AS CardLast4, " +
        "type AS Type, title AS Title, body AS Body, severity AS Severity, " +
        "created_at AS CreatedAt, read_at AS ReadAt";

    private const string ListAllSql =
        $"SELECT {Columns} FROM card_notification WHERE customer_id = @CustomerId " +
        "ORDER BY created_at DESC, id LIMIT @Size OFFSET @Offset";

    private const string ListUnreadSql =
        $"SELECT {Columns} FROM card_notification WHERE customer_id = @CustomerId AND read_at IS NULL " +
        "ORDER BY created_at DESC, id LIMIT @Size OFFSET @Offset";

    public async Task<IReadOnlyList<Notification>> ListAsync(
        string customerId, bool unreadOnly, int page, int size, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<NotificationRow>(new CommandDefinition(
            unreadOnly ? ListUnreadSql : ListAllSql,
            new { CustomerId = customerId, Size = size, Offset = (page - 1) * size },
            cancellationToken: ct));
        return rows.Select(r => r.ToDomain()).ToList();
    }

    public async Task<int> CountUnreadAsync(string customerId, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
            "SELECT COUNT(*)::int FROM card_notification WHERE customer_id = @CustomerId AND read_at IS NULL",
            new { CustomerId = customerId },
            cancellationToken: ct));
    }

    public async Task AddAsync(Notification n, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        await connection.ExecuteAsync(new CommandDefinition(
            "INSERT INTO card_notification (id, customer_id, card_ref, card_last4, type, title, body, severity, created_at) " +
            "VALUES (@Id, @CustomerId, @CardRef, @CardLast4, @Type, @Title, @Body, @Severity, @CreatedAt)",
            new
            {
                n.Id,
                n.CustomerId,
                n.CardRef,
                n.CardLast4,
                Type = n.Type.ToString(),
                n.Title,
                n.Body,
                Severity = n.Severity.ToString(),
                CreatedAt = n.CreatedAt.UtcDateTime
            },
            cancellationToken: ct));
    }

    public async Task<bool> MarkReadAsync(string customerId, Guid id, DateTimeOffset readAt, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var affected = await connection.ExecuteAsync(new CommandDefinition(
            "UPDATE card_notification SET read_at = COALESCE(read_at, @ReadAt) " +
            "WHERE id = @Id AND customer_id = @CustomerId",
            new { Id = id, CustomerId = customerId, ReadAt = readAt.UtcDateTime },
            cancellationToken: ct));
        return affected > 0;
    }

    public async Task<int> MarkAllReadAsync(string customerId, DateTimeOffset readAt, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        return await connection.ExecuteAsync(new CommandDefinition(
            "UPDATE card_notification SET read_at = @ReadAt WHERE customer_id = @CustomerId AND read_at IS NULL",
            new { CustomerId = customerId, ReadAt = readAt.UtcDateTime },
            cancellationToken: ct));
    }

    public async Task<IReadOnlyList<Preference>> GetPreferencesAsync(string customerId, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<PreferenceRow>(new CommandDefinition(
            "SELECT event_type AS EventType, channel AS Channel, enabled AS Enabled " +
            "FROM notification_preference WHERE customer_id = @CustomerId",
            new { CustomerId = customerId },
            cancellationToken: ct));
        return rows
            .Where(r => Enum.TryParse<NotificationType>(r.EventType, out _) && Enum.TryParse<Channel>(r.Channel, out _))
            .Select(r => new Preference(Enum.Parse<NotificationType>(r.EventType), Enum.Parse<Channel>(r.Channel), r.Enabled))
            .ToList();
    }

    public async Task SavePreferencesAsync(string customerId, IReadOnlyList<Preference> preferences, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        await using var transaction = await connection.BeginTransactionAsync(ct);
        foreach (var p in preferences)
        {
            await connection.ExecuteAsync(new CommandDefinition(
                "INSERT INTO notification_preference (customer_id, event_type, channel, enabled) " +
                "VALUES (@CustomerId, @EventType, @Channel, @Enabled) " +
                "ON CONFLICT (customer_id, event_type, channel) DO UPDATE SET enabled = EXCLUDED.enabled",
                new { CustomerId = customerId, EventType = p.EventType.ToString(), Channel = p.Channel.ToString(), p.Enabled },
                transaction,
                cancellationToken: ct));
        }
        await transaction.CommitAsync(ct);
    }

    private sealed class NotificationRow
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string CardRef { get; set; } = "";
        public string CardLast4 { get; set; } = "";
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Body { get; set; } = "";
        public string Severity { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }

        public Notification ToDomain() => new(
            Id, CustomerId, CardRef, CardLast4,
            Enum.Parse<NotificationType>(Type), Title, Body, Enum.Parse<Severity>(Severity),
            AsUtc(CreatedAt), ReadAt.HasValue ? AsUtc(ReadAt.Value) : null);

        private static DateTimeOffset AsUtc(DateTime value) =>
            new(DateTime.SpecifyKind(value, DateTimeKind.Utc));
    }

    private sealed class PreferenceRow
    {
        public string EventType { get; set; } = "";
        public string Channel { get; set; } = "";
        public bool Enabled { get; set; }
    }
}

using Dapper;
using Notifications.Application;
using Notifications.Domain;
using Npgsql;

namespace Notifications.Infrastructure;

/// <summary>Repositorio PostgreSQL. Todo el SQL es parametrizado y filtra por cliente (anti-IDOR).</summary>
public sealed class NpgsqlNotificationRepository(NpgsqlDataSource dataSource) : INotificationRepository
{
    private const string ListSql = """
        SELECT id AS Id, account_id AS AccountId, customer_id AS CustomerId, type AS Type,
               title AS Title, message AS Message, created_at AS CreatedAt, read_at AS ReadAt
        FROM account_notification
        WHERE account_id = @accountId
          AND customer_id = @customerId
          AND (@unreadOnly = FALSE OR read_at IS NULL)
        ORDER BY created_at DESC
        LIMIT 100
        """;

    private const string MarkReadSql = """
        UPDATE account_notification
        SET read_at = COALESCE(read_at, @readAt)
        WHERE id = @id AND customer_id = @customerId
        """;

    private const string GetPreferencesSql = """
        SELECT type AS Type, enabled AS Enabled
        FROM notification_preference
        WHERE account_id = @accountId AND customer_id = @customerId
        """;

    private const string UpsertPreferenceSql = """
        INSERT INTO notification_preference (account_id, type, customer_id, enabled)
        VALUES (@accountId, @type, @customerId, @enabled)
        ON CONFLICT (account_id, type)
        DO UPDATE SET enabled = EXCLUDED.enabled
        WHERE notification_preference.customer_id = EXCLUDED.customer_id
        """;

    public async Task<IReadOnlyList<Notification>> ListAsync(
        string customerId, string accountId, bool unreadOnly, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<NotificationRow>(new CommandDefinition(
            ListSql, new { accountId, customerId, unreadOnly }, cancellationToken: ct));

        return rows.Select(ToDomain).ToList();
    }

    public async Task<bool> MarkReadAsync(Guid id, string customerId, DateTimeOffset readAt, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var affected = await connection.ExecuteAsync(new CommandDefinition(
            MarkReadSql, new { id, customerId, readAt }, cancellationToken: ct));

        return affected > 0;
    }

    public async Task<IReadOnlyList<NotificationPreference>> GetPreferencesAsync(
        string customerId, string accountId, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<PreferenceRow>(new CommandDefinition(
            GetPreferencesSql, new { accountId, customerId }, cancellationToken: ct));

        return rows
            .Where(r => NotificationTypeCodes.TryParse(r.Type, out _))
            .Select(r =>
            {
                NotificationTypeCodes.TryParse(r.Type, out var type);
                return new NotificationPreference(type, r.Enabled);
            })
            .ToList();
    }

    public async Task SavePreferencesAsync(
        string customerId, string accountId, IReadOnlyList<NotificationPreference> preferences, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        await using var transaction = await connection.BeginTransactionAsync(ct);

        foreach (var preference in preferences)
        {
            await connection.ExecuteAsync(new CommandDefinition(
                UpsertPreferenceSql,
                new { accountId, type = preference.Type.ToCode(), customerId, enabled = preference.Enabled },
                transaction,
                cancellationToken: ct));
        }

        await transaction.CommitAsync(ct);
    }

    private static Notification ToDomain(NotificationRow row)
    {
        if (!NotificationTypeCodes.TryParse(row.Type, out var type))
        {
            throw new InvalidOperationException($"Tipo de notificación desconocido en BD: {row.Type}");
        }

        return new Notification(row.Id, row.AccountId, row.CustomerId, type, row.Title, row.Message, row.CreatedAt, row.ReadAt);
    }

    private sealed class NotificationRow
    {
        public Guid Id { get; set; }
        public string AccountId { get; set; } = "";
        public string CustomerId { get; set; } = "";
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? ReadAt { get; set; }
    }

    private sealed class PreferenceRow
    {
        public string Type { get; set; } = "";
        public bool Enabled { get; set; }
    }
}

using Dapper;
using Notifications.Application;
using Notifications.Domain;
using Npgsql;

namespace Notifications.Infrastructure;

/// <summary>Repositorio PostgreSQL. Todo el SQL es parametrizado y filtra por customer_id.</summary>
public sealed class PgNotificationRepository(string connectionString) : INotificationRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, account_id AS AccountId, type AS Type, " +
        "title AS Title, message AS Message, created_at AS CreatedAt, read_at AS ReadAt";

    private sealed class Row
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string AccountId { get; set; } = "";
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    public async Task<(IReadOnlyList<Notification> Items, int Total)> ListAsync(
        string customerId, string accountId, bool unreadOnly, int page, int pageSize, CancellationToken ct)
    {
        const string filter =
            "WHERE customer_id = @customerId AND account_id = @accountId AND (@unreadOnly = FALSE OR read_at IS NULL)";
        var args = new { customerId, accountId, unreadOnly, limit = pageSize, offset = (page - 1) * pageSize };

        await using var connection = new NpgsqlConnection(connectionString);
        var rows = await connection.QueryAsync<Row>(new CommandDefinition(
            $"SELECT {Columns} FROM account_notification {filter} ORDER BY created_at DESC LIMIT @limit OFFSET @offset",
            args, cancellationToken: ct));
        var total = await connection.ExecuteScalarAsync<int>(new CommandDefinition(
            $"SELECT COUNT(*) FROM account_notification {filter}", args, cancellationToken: ct));
        return (rows.Select(ToDomain).ToList(), total);
    }

    public async Task<int> CountUnreadAsync(string customerId, string accountId, CancellationToken ct)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
            "SELECT COUNT(*) FROM account_notification " +
            "WHERE customer_id = @customerId AND account_id = @accountId AND read_at IS NULL",
            new { customerId, accountId }, cancellationToken: ct));
    }

    public async Task<Notification?> FindAsync(string customerId, Guid id, CancellationToken ct)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        var row = await connection.QuerySingleOrDefaultAsync<Row>(new CommandDefinition(
            $"SELECT {Columns} FROM account_notification WHERE id = @id AND customer_id = @customerId",
            new { id, customerId }, cancellationToken: ct));
        return row is null ? null : ToDomain(row);
    }

    public async Task SaveReadAsync(Notification notification, CancellationToken ct)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.ExecuteAsync(new CommandDefinition(
            "UPDATE account_notification SET read_at = @readAt " +
            "WHERE id = @id AND customer_id = @customerId AND read_at IS NULL",
            new { readAt = notification.ReadAt?.UtcDateTime, id = notification.Id, customerId = notification.CustomerId },
            cancellationToken: ct));
    }

    private static Notification ToDomain(Row r) => new(
        r.Id, r.CustomerId, r.AccountId, NotificationTypeCodes.Parse(r.Type), r.Title, r.Message,
        new DateTimeOffset(DateTime.SpecifyKind(r.CreatedAt, DateTimeKind.Utc)),
        r.ReadAt is null ? null : new DateTimeOffset(DateTime.SpecifyKind(r.ReadAt.Value, DateTimeKind.Utc)));
}

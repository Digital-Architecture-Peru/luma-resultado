using Dapper;
using Npgsql;
using Payments.Notifications.Application;
using Payments.Notifications.Domain;

namespace Payments.Notifications.Infrastructure;

/// <summary>Repositorio PostgreSQL con Npgsql + Dapper. Todo el SQL es parametrizado.</summary>
public sealed class PostgresNotificationRepository(NpgsqlDataSource dataSource) : INotificationRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, payment_ref AS PaymentRef, type AS Type, title AS Title, " +
        "body AS Body, amount AS Amount, currency AS Currency, created_at AS CreatedAt, read_at AS ReadAt";

    private const string ListSql =
        $"SELECT {Columns} FROM payment_notifications " +
        "WHERE customer_id = @customerId AND (@unreadOnly = false OR read_at IS NULL) " +
        "ORDER BY created_at DESC, id LIMIT @size OFFSET @offset";

    private const string CountSql =
        "SELECT COUNT(*) FROM payment_notifications " +
        "WHERE customer_id = @customerId AND (@unreadOnly = false OR read_at IS NULL)";

    private const string FindSql =
        $"SELECT {Columns} FROM payment_notifications WHERE customer_id = @customerId AND id = @id";

    private const string UpdateReadSql =
        "UPDATE payment_notifications SET read_at = @readAt " +
        "WHERE id = @id AND customer_id = @customerId AND read_at IS NULL";

    public async Task<PagedResult<PaymentNotification>> ListAsync(
        string customerId, bool unreadOnly, int page, int size, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<Row>(new CommandDefinition(
            ListSql, new { customerId, unreadOnly, size, offset = (page - 1) * size }, cancellationToken: ct));
        var total = await connection.ExecuteScalarAsync<long>(new CommandDefinition(
            CountSql, new { customerId, unreadOnly }, cancellationToken: ct));
        return new PagedResult<PaymentNotification>(rows.Select(r => r.ToDomain()).ToList(), (int)total, page, size);
    }

    public async Task<int> CountUnreadAsync(string customerId, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var total = await connection.ExecuteScalarAsync<long>(new CommandDefinition(
            CountSql, new { customerId, unreadOnly = true }, cancellationToken: ct));
        return (int)total;
    }

    public async Task<PaymentNotification?> FindAsync(string customerId, Guid id, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);
        var row = await connection.QuerySingleOrDefaultAsync<Row>(new CommandDefinition(
            FindSql, new { customerId, id }, cancellationToken: ct));
        return row?.ToDomain();
    }

    public async Task UpdateReadAsync(PaymentNotification notification, CancellationToken ct)
    {
        if (notification.ReadAt is not { } readAt) return;

        await using var connection = await dataSource.OpenConnectionAsync(ct);
        await connection.ExecuteAsync(new CommandDefinition(
            UpdateReadSql,
            new { id = notification.Id, customerId = notification.CustomerId, readAt = readAt.UtcDateTime },
            cancellationToken: ct));
    }

    private sealed class Row
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string PaymentRef { get; set; } = "";
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Body { get; set; } = "";
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }

        public PaymentNotification ToDomain() => new(
            Id, CustomerId, PaymentRef, NotificationTypeCodes.Parse(Type), Title, Body, Amount, Currency.Trim(),
            ToUtc(CreatedAt), ReadAt is { } r ? ToUtc(r) : null);

        private static DateTimeOffset ToUtc(DateTime value) =>
            new(DateTime.SpecifyKind(value, DateTimeKind.Utc));
    }
}

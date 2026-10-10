using Notifications.Domain;

namespace Notifications.Application;

public sealed class InvalidRequestException(string message) : Exception(message);

public sealed record NotificationDto(
    Guid Id,
    string AccountId,
    string Type,
    string Title,
    string Message,
    DateTimeOffset CreatedAt,
    bool Read);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Total);

public interface INotificationRepository
{
    Task<(IReadOnlyList<Notification> Items, int Total)> ListAsync(
        string customerId, string accountId, bool unreadOnly, int page, int pageSize, CancellationToken ct);

    Task<int> CountUnreadAsync(string customerId, string accountId, CancellationToken ct);

    /// <summary>Busca siempre por cliente propietario (evita IDOR).</summary>
    Task<Notification?> FindAsync(string customerId, Guid id, CancellationToken ct);

    Task SaveReadAsync(Notification notification, CancellationToken ct);
}

public sealed class NotificationService(INotificationRepository repository, TimeProvider clock)
{
    public const int MaxPageSize = 100;

    public async Task<PagedResult<NotificationDto>> ListAsync(
        string customerId, string accountId, string? status, int page, int pageSize, CancellationToken ct = default)
    {
        RequireText(customerId, nameof(customerId));
        RequireText(accountId, nameof(accountId));
        if (page < 1) throw new InvalidRequestException("page debe ser >= 1.");
        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new InvalidRequestException($"pageSize debe estar entre 1 y {MaxPageSize}.");

        var normalized = (status ?? "all").ToLowerInvariant();
        if (normalized is not ("all" or "unread"))
            throw new InvalidRequestException("status debe ser 'all' o 'unread'.");

        var (items, total) = await repository.ListAsync(
            customerId, accountId, normalized == "unread", page, pageSize, ct);
        return new PagedResult<NotificationDto>(items.Select(ToDto).ToList(), total);
    }

    public Task<int> UnreadCountAsync(string customerId, string accountId, CancellationToken ct = default)
    {
        RequireText(customerId, nameof(customerId));
        RequireText(accountId, nameof(accountId));
        return repository.CountUnreadAsync(customerId, accountId, ct);
    }

    /// <returns>false si no existe o no pertenece al cliente.</returns>
    public async Task<bool> MarkReadAsync(string customerId, Guid id, CancellationToken ct = default)
    {
        RequireText(customerId, nameof(customerId));
        var current = await repository.FindAsync(customerId, id, ct);
        if (current is null) return false;
        if (current.IsRead) return true;

        await repository.SaveReadAsync(current.MarkRead(clock.GetUtcNow()), ct);
        return true;
    }

    private static NotificationDto ToDto(Notification n) => new(
        n.Id, n.AccountId, NotificationTypeCodes.ToCode(n.Type), n.Title, n.Message, n.CreatedAt, n.IsRead);

    private static void RequireText(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new InvalidRequestException($"{name} es obligatorio.");
    }
}

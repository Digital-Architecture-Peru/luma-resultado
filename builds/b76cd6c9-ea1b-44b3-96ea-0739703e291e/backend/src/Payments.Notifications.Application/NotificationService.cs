namespace Payments.Notifications.Application;

public interface INotificationService
{
    Task<PagedResult<NotificationDto>> ListAsync(string customerId, string status, int page, int size, CancellationToken ct);
    Task<UnreadCountDto> GetUnreadCountAsync(string customerId, CancellationToken ct);
    Task<NotificationDto> MarkAsReadAsync(string customerId, Guid id, CancellationToken ct);
}

public sealed class NotificationService(INotificationRepository repository, TimeProvider clock) : INotificationService
{
    public const int MaxPageSize = 100;

    public async Task<PagedResult<NotificationDto>> ListAsync(
        string customerId, string status, int page, int size, CancellationToken ct)
    {
        RequireCustomer(customerId);
        if (page < 1) throw new InvalidRequestException("page debe ser mayor o igual a 1.");
        if (size < 1 || size > MaxPageSize) throw new InvalidRequestException($"size debe estar entre 1 y {MaxPageSize}.");

        var unreadOnly = status switch
        {
            "unread" => true,
            "all" => false,
            _ => throw new InvalidRequestException("status debe ser 'unread' o 'all'.")
        };

        var result = await repository.ListAsync(customerId, unreadOnly, page, size, ct);
        return new PagedResult<NotificationDto>(
            result.Items.Select(NotificationDto.From).ToList(), result.Total, result.Page, result.Size);
    }

    public async Task<UnreadCountDto> GetUnreadCountAsync(string customerId, CancellationToken ct)
    {
        RequireCustomer(customerId);
        return new UnreadCountDto(await repository.CountUnreadAsync(customerId, ct));
    }

    public async Task<NotificationDto> MarkAsReadAsync(string customerId, Guid id, CancellationToken ct)
    {
        RequireCustomer(customerId);
        var notification = await repository.FindAsync(customerId, id, ct)
            ?? throw new NotificationNotFoundException(id);

        if (notification.MarkAsRead(clock.GetUtcNow()))
        {
            await repository.UpdateReadAsync(notification, ct);
        }

        return NotificationDto.From(notification);
    }

    private static void RequireCustomer(string customerId)
    {
        if (string.IsNullOrWhiteSpace(customerId))
            throw new InvalidRequestException("Falta el identificador del cliente.");
    }
}

using Microsoft.AspNetCore.Mvc;
using Payments.Notifications.Application;

namespace Payments.Notifications.Api.Controllers;

[ApiController]
[Route("api/v1/notifications")]
public sealed class NotificationsController(INotificationService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<NotificationDto>>> List(
        [FromQuery] string status = "all",
        [FromQuery] int page = 1,
        [FromQuery] int size = 20,
        CancellationToken ct = default)
    {
        var customerId = CustomerIdResolver.Resolve(Request);
        return Ok(await service.ListAsync(customerId, status, page, size, ct));
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<UnreadCountDto>> UnreadCount(CancellationToken ct)
    {
        var customerId = CustomerIdResolver.Resolve(Request);
        return Ok(await service.GetUnreadCountAsync(customerId, ct));
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult<NotificationDto>> MarkAsRead(Guid id, CancellationToken ct)
    {
        var customerId = CustomerIdResolver.Resolve(Request);
        return Ok(await service.MarkAsReadAsync(customerId, id, ct));
    }
}

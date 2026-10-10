using Microsoft.AspNetCore.Mvc;
using Notifications.Application;

namespace Notifications.Api.Controllers;

[ApiController]
[Route("api/v1")]
public sealed class NotificationsController(NotificationService service, ILogger<NotificationsController> logger)
    : ControllerBase
{
    // H2: identidad simulada por cabecera; la autenticación real queda fuera de alcance.
    private const string CustomerHeader = "X-Customer-Id";

    [HttpGet("accounts/{accountId}/notifications")]
    public async Task<IActionResult> List(
        string accountId, [FromQuery] string? status, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        return await Run(async customerId => Ok(await service.ListAsync(customerId, accountId, status, page, pageSize, ct)));
    }

    [HttpGet("accounts/{accountId}/notifications/unread-count")]
    public async Task<IActionResult> UnreadCount(string accountId, CancellationToken ct)
    {
        return await Run(async customerId => Ok(new { count = await service.UnreadCountAsync(customerId, accountId, ct) }));
    }

    [HttpPatch("notifications/{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        return await Run(async customerId =>
        {
            var found = await service.MarkReadAsync(customerId, id, ct);
            if (!found) logger.LogInformation("Notificación {NotificationId} no encontrada para el cliente", id);
            return found ? NoContent() : Problem(statusCode: 404, title: "Notificación no encontrada");
        });
    }

    private async Task<IActionResult> Run(Func<string, Task<IActionResult>> action)
    {
        var customerId = Request.Headers[CustomerHeader].ToString();
        if (string.IsNullOrWhiteSpace(customerId))
            return Problem(statusCode: 400, title: "Solicitud inválida", detail: $"Falta la cabecera {CustomerHeader}.");
        try
        {
            return await action(customerId);
        }
        catch (InvalidRequestException ex)
        {
            return Problem(statusCode: 400, title: "Solicitud inválida", detail: ex.Message);
        }
    }
}

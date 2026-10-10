using Microsoft.AspNetCore.Mvc;
using Notifications.Application;

namespace Notifications.Api.Controllers;

[ApiController]
public sealed class NotificationsController(NotificationService service) : ControllerBase
{
    // Simulación de identidad (hipótesis H2): reemplazar por autenticación real antes de cualquier uso.
    private const string CustomerHeader = "X-Demo-Customer";

    [HttpGet("api/accounts/{accountId}/notifications")]
    public Task<IActionResult> List(string accountId, [FromQuery] bool unreadOnly, CancellationToken ct) =>
        Guard(async customerId =>
            Ok(await service.ListAsync(customerId, accountId, unreadOnly, ct)));

    [HttpPatch("api/notifications/{id:guid}/read")]
    public Task<IActionResult> MarkRead(Guid id, CancellationToken ct) =>
        Guard(async customerId =>
            await service.MarkReadAsync(customerId, id, ct)
                ? NoContent()
                : Problem(statusCode: StatusCodes.Status404NotFound, title: "Notificación no encontrada"));

    [HttpGet("api/accounts/{accountId}/notification-preferences")]
    public Task<IActionResult> GetPreferences(string accountId, CancellationToken ct) =>
        Guard(async customerId =>
            Ok(await service.GetPreferencesAsync(customerId, accountId, ct)));

    [HttpPut("api/accounts/{accountId}/notification-preferences")]
    public Task<IActionResult> SavePreferences(
        string accountId, [FromBody] List<PreferenceDto> preferences, CancellationToken ct) =>
        Guard(async customerId =>
        {
            await service.SavePreferencesAsync(customerId, accountId, preferences, ct);
            return NoContent();
        });

    private async Task<IActionResult> Guard(Func<string, Task<IActionResult>> action)
    {
        var customerId = Request.Headers[CustomerHeader].ToString();
        if (string.IsNullOrWhiteSpace(customerId))
        {
            return Problem(statusCode: StatusCodes.Status400BadRequest, title: $"Falta la cabecera {CustomerHeader}");
        }

        try
        {
            return await action(customerId);
        }
        catch (InvalidNotificationRequestException ex)
        {
            return Problem(statusCode: StatusCodes.Status422UnprocessableEntity, title: "Solicitud inválida", detail: ex.Message);
        }
    }
}

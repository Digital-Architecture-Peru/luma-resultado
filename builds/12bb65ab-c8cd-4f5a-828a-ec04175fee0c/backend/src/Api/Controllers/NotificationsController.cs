using Microsoft.AspNetCore.Mvc;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Api.Controllers;

public sealed record NotificationDto(
    Guid Id, string CardLast4, NotificationType Type, string Title, string Body, DateTimeOffset CreatedAt, bool IsRead);

public sealed record PreferenceDto(NotificationType Type, Channel Channel, bool Enabled);

[ApiController]
[Route("api/v1")]
public sealed class NotificationsController(NotificationService service) : ControllerBase
{
    [HttpGet("notifications")]
    public async Task<ActionResult<PagedResult<NotificationDto>>> List(
        [FromQuery] bool unreadOnly = false, [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await service.ListAsync(unreadOnly, page, pageSize, ct);
        var items = result.Items.Select(ToDto).ToList();
        return Ok(new PagedResult<NotificationDto>(items, result.Page, result.PageSize, result.Total));
    }

    [HttpPatch("notifications/{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        await service.MarkReadAsync(id, ct);
        return NoContent();
    }

    [HttpGet("notification-preferences")]
    public async Task<ActionResult<IReadOnlyList<PreferenceDto>>> GetPreferences(CancellationToken ct)
    {
        var prefs = await service.GetPreferencesAsync(ct);
        return Ok(prefs.Select(ToDto).ToList());
    }

    [HttpPut("notification-preferences")]
    public async Task<ActionResult<IReadOnlyList<PreferenceDto>>> UpdatePreferences(
        [FromBody] List<PreferenceDto> body, CancellationToken ct)
    {
        var domain = body.Select(p => new Preference(p.Type, p.Channel, p.Enabled)).ToList();
        var saved = await service.UpdatePreferencesAsync(domain, ct);
        return Ok(saved.Select(ToDto).ToList());
    }

    private static NotificationDto ToDto(Notification n) =>
        new(n.Id, n.CardLast4, n.Type, n.Title, n.Body, n.CreatedAt, n.IsRead);

    private static PreferenceDto ToDto(Preference p) => new(p.Type, p.Channel, p.Enabled);
}

using System.ComponentModel.DataAnnotations;
using CardNotifications.Application;
using CardNotifications.Domain;
using Microsoft.AspNetCore.Mvc;

namespace CardNotifications.Api;

public enum StatusFilter { All, Unread }

public sealed record NotificationDto(
    Guid Id,
    string CardLast4,
    NotificationType Type,
    string Title,
    string Body,
    Severity Severity,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public static NotificationDto From(Notification n) =>
        new(n.Id, n.CardLast4, n.Type, n.Title, n.Body, n.Severity, n.CreatedAt, n.ReadAt);
}

public sealed record NotificationPageDto(IReadOnlyList<NotificationDto> Items, int Unread, int Page, int Size);

public sealed record PreferenceDto(NotificationType EventType, Channel Channel, bool Enabled)
{
    public static PreferenceDto From(Preference p) => new(p.EventType, p.Channel, p.Enabled);
    public Preference ToDomain() => new(EventType, Channel, Enabled);
}

public sealed record UpdatePreferencesRequest([property: Required] List<PreferenceDto> Preferences);

[ApiController]
[Route("api/v1/cards")]
public sealed class NotificationsController(NotificationService service, ICurrentCustomer currentCustomer)
    : ControllerBase
{
    [HttpGet("notifications")]
    public async Task<ActionResult<NotificationPageDto>> List(
        [FromQuery] StatusFilter status = StatusFilter.All,
        [FromQuery, Range(1, 100000)] int page = 1,
        [FromQuery, Range(1, NotificationService.MaxPageSize)] int size = 20,
        CancellationToken ct = default)
    {
        if (!TryGetCustomer(out var customerId)) return Unauthorized();

        var result = await service.ListAsync(customerId, status == StatusFilter.Unread, page, size, ct);
        return new NotificationPageDto(result.Items.Select(NotificationDto.From).ToList(), result.Unread, result.Page, result.Size);
    }

    [HttpPatch("notifications/{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        if (!TryGetCustomer(out var customerId)) return Unauthorized();

        await service.MarkReadAsync(customerId, id, ct);
        return NoContent();
    }

    [HttpPost("notifications/read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken ct)
    {
        if (!TryGetCustomer(out var customerId)) return Unauthorized();

        return Ok(new { updated = await service.MarkAllReadAsync(customerId, ct) });
    }

    [HttpGet("notification-preferences")]
    public async Task<ActionResult<IReadOnlyList<PreferenceDto>>> GetPreferences(CancellationToken ct)
    {
        if (!TryGetCustomer(out var customerId)) return Unauthorized();

        var preferences = await service.GetPreferencesAsync(customerId, ct);
        return preferences.Select(PreferenceDto.From).ToList();
    }

    [HttpPut("notification-preferences")]
    public async Task<ActionResult<IReadOnlyList<PreferenceDto>>> SavePreferences(
        [FromBody] UpdatePreferencesRequest request, CancellationToken ct)
    {
        if (!TryGetCustomer(out var customerId)) return Unauthorized();

        var saved = await service.SavePreferencesAsync(customerId, request.Preferences.Select(p => p.ToDomain()).ToList(), ct);
        return saved.Select(PreferenceDto.From).ToList();
    }

    private bool TryGetCustomer(out string customerId)
    {
        customerId = currentCustomer.Resolve(HttpContext) ?? "";
        return customerId.Length > 0;
    }
}

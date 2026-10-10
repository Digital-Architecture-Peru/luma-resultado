using Microsoft.AspNetCore.Mvc;
using Notifications.Application;

namespace Notifications.Api;

[ApiController]
[Route("api/v1")]
public sealed class NotificationsController : ControllerBase
{
    // H1: marcador ficticio de identidad. En producción debe provenir de un claim del token.
    private const string CustomerHeader = "X-Customer-Id";

    private readonly NotificationService _service;

    public NotificationsController(NotificationService service) => _service = service;

    [HttpGet("notifications")]
    public async Task<IActionResult> List(
        [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int size = 20, CancellationToken ct = default)
    {
        if (!TryGetCustomer(out var customer)) return MissingCustomer();
        return Ok(await _service.ListAsync(customer, status, page, size, ct));
    }

    [HttpGet("notifications/unread-count")]
    public async Task<IActionResult> UnreadCount(CancellationToken ct)
    {
        if (!TryGetCustomer(out var customer)) return MissingCustomer();
        return Ok(new { count = await _service.UnreadCountAsync(customer, ct) });
    }

    [HttpPatch("notifications/{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken ct)
    {
        if (!TryGetCustomer(out var customer)) return MissingCustomer();
        var updated = await _service.MarkReadAsync(customer, id, ct);
        return updated is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "No encontrada", detail: "La notificación no existe.")
            : Ok(updated);
    }

    [HttpPost("payment-events")]
    public async Task<IActionResult> Ingest([FromBody] PaymentEvent evt, CancellationToken ct)
    {
        if (!TryGetCustomer(out var customer)) return MissingCustomer();
        var result = await _service.IngestAsync(customer, evt, ct);
        // 201 si se creó; 200 si el evento ya había sido procesado (idempotencia).
        return result.Created
            ? Created($"/api/v1/notifications?status=UNREAD", result.Notification)
            : Ok(result.Notification);
    }

    private bool TryGetCustomer(out string customer)
    {
        customer = Request.Headers[CustomerHeader].ToString();
        return !string.IsNullOrWhiteSpace(customer);
    }

    private IActionResult MissingCustomer() =>
        Problem(statusCode: StatusCodes.Status400BadRequest, title: "Cliente no identificado",
            detail: $"Falta la cabecera {CustomerHeader}.");
}

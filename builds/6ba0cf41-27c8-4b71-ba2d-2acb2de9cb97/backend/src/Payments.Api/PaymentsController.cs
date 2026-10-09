using Microsoft.AspNetCore.Mvc;
using Payments.Application;

namespace Payments.Api;

[ApiController]
[Route("api/v1/payments")]
public sealed class PaymentsController : ControllerBase
{
    private readonly CreatePaymentHandler _create;
    private readonly PaymentQueryService _queries;

    public PaymentsController(CreatePaymentHandler create, PaymentQueryService queries)
    {
        _create = create;
        _queries = queries;
    }

    // X-Customer-Id simula al cliente autenticado; en real lo resuelve el gateway/BFF.
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromHeader(Name = "X-Customer-Id")] string customerId,
        [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
        [FromBody] CreatePaymentRequest request,
        CancellationToken ct)
    {
        var response = await _create.HandleAsync(customerId, idempotencyKey, request, ct);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        [FromHeader(Name = "X-Customer-Id")] string customerId,
        CancellationToken ct)
    {
        var response = await _queries.GetAsync(customerId, id, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string accountId,
        [FromHeader(Name = "X-Customer-Id")] string customerId,
        CancellationToken ct)
        => Ok(await _queries.ListAsync(customerId, accountId, ct));
}

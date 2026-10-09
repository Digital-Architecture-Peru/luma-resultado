using Cards.Application;
using Microsoft.AspNetCore.Mvc;

namespace Cards.Api;

[ApiController]
[Route("api/v1/cards")]
public sealed class CardsController(CardQueries queries, PayCardHandler payCard) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CardDto>>> List(CancellationToken ct) =>
        Ok(await queries.ListCardsAsync(ct));

    [HttpGet("{id:guid}/transactions")]
    public async Task<ActionResult<IReadOnlyList<TransactionDto>>> Transactions(
        Guid id, [FromQuery] int page = 1, CancellationToken ct = default) =>
        Ok(await queries.ListTransactionsAsync(id, page, ct));

    [HttpPost("{id:guid}/payments")]
    public async Task<ActionResult<TransactionDto>> Pay(
        Guid id,
        [FromBody] PaymentRequest request,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken ct)
    {
        var outcome = await payCard.HandleAsync(new PayCardCommand(id, idempotencyKey, request), ct);
        var status = outcome.Replayed ? StatusCodes.Status200OK : StatusCodes.Status201Created;
        return StatusCode(status, outcome.Transaction.ToDto());
    }
}

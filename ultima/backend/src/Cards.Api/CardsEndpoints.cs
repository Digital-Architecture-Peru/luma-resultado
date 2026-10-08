using Cards.Application;
using Microsoft.AspNetCore.Mvc;

namespace Cards.Api;

public static class CardsEndpoints
{
    public static IEndpointRouteBuilder MapCardsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/cards");
        group.MapGet("/", ListAsync);
        group.MapGet("/{cardId:guid}", GetAsync);
        group.MapGet("/{cardId:guid}/movements", MovementsAsync);
        return app;
    }

    private static IResult Unauthenticated() =>
        Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "No autenticado");

    private static IResult CardNotFound() =>
        Results.Problem(statusCode: StatusCodes.Status404NotFound, title: "Tarjeta no encontrada");

    private static async Task<IResult> ListAsync(
        HttpContext context,
        [FromServices] IHostEnvironment env,
        [FromServices] CardQueryService service,
        CancellationToken ct)
    {
        if (CurrentCustomer.Resolve(context, env) is not Guid customerId)
        {
            return Unauthenticated();
        }

        return Results.Ok(await service.ListAsync(customerId, ct));
    }

    private static async Task<IResult> GetAsync(
        Guid cardId,
        HttpContext context,
        [FromServices] IHostEnvironment env,
        [FromServices] CardQueryService service,
        CancellationToken ct)
    {
        if (CurrentCustomer.Resolve(context, env) is not Guid customerId)
        {
            return Unauthenticated();
        }

        var card = await service.GetAsync(customerId, cardId, ct);
        return card is null ? CardNotFound() : Results.Ok(card);
    }

    private static async Task<IResult> MovementsAsync(
        Guid cardId,
        HttpContext context,
        [FromServices] IHostEnvironment env,
        [FromServices] CardQueryService service,
        CancellationToken ct,
        int page = 1,
        int size = 20)
    {
        if (CurrentCustomer.Resolve(context, env) is not Guid customerId)
        {
            return Unauthenticated();
        }

        try
        {
            var result = await service.GetMovementsAsync(customerId, cardId, page, size, ct);
            return result is null ? CardNotFound() : Results.Ok(result);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return Results.Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Parámetros de paginación inválidos",
                detail: ex.Message);
        }
    }
}

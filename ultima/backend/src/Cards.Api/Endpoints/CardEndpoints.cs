using Cards.Application;

namespace Cards.Api.Endpoints;

public static class CardEndpoints
{
    public static IEndpointRouteBuilder MapCardEndpoints(this IEndpointRouteBuilder app)
    {
        var v1 = app.MapGroup("/api/v1");

        v1.MapGet("/customers/{customerId}/cards",
            async Task<IResult> (string customerId, ICardQueryService service, CancellationToken ct) =>
            {
                try
                {
                    return Results.Ok(await service.GetCustomerCardsAsync(customerId, ct));
                }
                catch (ArgumentException ex)
                {
                    return Results.Problem(
                        title: "Solicitud inválida", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
                }
            });

        v1.MapGet("/cards/{cardId:guid}",
            async Task<IResult> (Guid cardId, ICardQueryService service, CancellationToken ct) =>
            {
                var detail = await service.GetCardDetailAsync(cardId, ct);
                return detail is null
                    ? Results.Problem(
                        title: "Tarjeta no encontrada",
                        detail: "No existe una tarjeta con el identificador indicado.",
                        statusCode: StatusCodes.Status404NotFound)
                    : Results.Ok(detail);
            });

        return app;
    }
}

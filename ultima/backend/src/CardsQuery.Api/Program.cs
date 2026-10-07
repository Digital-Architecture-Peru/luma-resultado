using CardsQuery.Api.Adapters;
using CardsQuery.Api.Domain;
using CardsQuery.Api.Organisms;

var builder = WebApplication.CreateBuilder(args);

// Punto único de composición.
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ICardReader, InMemoryCardReader>();
builder.Services.AddSingleton<ICardQueryService, CardQueryService>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "UP" }));

var cards = app.MapGroup("/v1/customers/{customerId}/cards");

cards.MapGet("/", (string customerId, string? status, ICardQueryService service, int page = 1, int pageSize = 10) =>
    Handle(() => Results.Ok(service.List(customerId, status, page, pageSize))));

cards.MapGet("/{cardId}", (string customerId, string cardId, ICardQueryService service) =>
    Handle(() => Results.Ok(service.Get(customerId, cardId))));

app.Run();

static IResult Handle(Func<IResult> action)
{
    try
    {
        return action();
    }
    catch (InvalidQueryException ex)
    {
        return Results.Problem(title: "Consulta inválida", detail: ex.Message, statusCode: StatusCodes.Status400BadRequest);
    }
    catch (CardNotFoundException ex)
    {
        return Results.Problem(title: "No encontrada", detail: ex.Message, statusCode: StatusCodes.Status404NotFound);
    }
}

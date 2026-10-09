using Cards.Application;
using Cards.Infrastructure;

const string CustomerHeader = "X-Customer-Id";

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("CARDS_DB_CONNECTION") ?? "";
var corsOrigins = (Environment.GetEnvironmentVariable("CORS_ORIGINS") ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddSingleton<ICardRepository>(_ => new PostgresCardRepository(connectionString));
builder.Services.AddSingleton<CardQueryService>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(corsOrigins).WithHeaders(CustomerHeader).WithMethods("GET")));

var app = builder.Build();

app.UseCors();

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (CardNotFoundException)
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        await Results.Problem(statusCode: 404, title: "Tarjeta no encontrada").ExecuteAsync(context);
    }
    catch (Exception ex)
    {
        // No se registran payloads ni identificadores: solo el tipo de error.
        app.Logger.LogError("Error no controlado: {ErrorType}", ex.GetType().Name);
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await Results.Problem(statusCode: 500, title: "Error interno").ExecuteAsync(context);
    }
});

// H2: la autenticación no está definida; el cliente se simula con una cabecera (mock).
static bool TryReadCustomer(HttpRequest request, out Guid customerId)
{
    customerId = Guid.Empty;
    return request.Headers.TryGetValue(CustomerHeader, out var value) && Guid.TryParse(value, out customerId);
}

var cards = app.MapGroup("/api/v1/cards");

cards.MapGet("/", async (HttpRequest request, CardQueryService service, CancellationToken ct) =>
    TryReadCustomer(request, out var customerId)
        ? Results.Ok(await service.GetCardsAsync(customerId, ct))
        : Results.Problem(statusCode: 400, title: "Cabecera X-Customer-Id ausente o inválida"));

cards.MapGet("/{cardId:guid}", async (Guid cardId, HttpRequest request, CardQueryService service, CancellationToken ct) =>
    TryReadCustomer(request, out var customerId)
        ? Results.Ok(await service.GetCardAsync(customerId, cardId, ct))
        : Results.Problem(statusCode: 400, title: "Cabecera X-Customer-Id ausente o inválida"));

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

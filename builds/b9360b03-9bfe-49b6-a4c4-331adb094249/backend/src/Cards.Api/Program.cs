using Cards.Api;
using Cards.Application;
using Cards.Domain;
using Cards.Infrastructure;
using Microsoft.AspNetCore.Diagnostics;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Configuración solo por entorno: ConnectionStrings__Cards, Payments__MaxAmount, Cors__AllowedOrigin.
var connectionString = builder.Configuration.GetConnectionString("Cards")
    ?? throw new InvalidOperationException("Falta la variable de entorno ConnectionStrings__Cards.");
var maxAmount = builder.Configuration.GetValue<decimal?>("Payments:MaxAmount") ?? 5000m;
var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";

builder.Services.AddProblemDetails();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigin).WithHeaders("Content-Type", "Idempotency-Key", "X-Customer-Id").WithMethods("GET", "POST")));
builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton(new PaymentLimits(maxAmount));
builder.Services.AddSingleton<ICardTransactionRepository, DapperCardTransactionRepository>();
builder.Services.AddSingleton<ICardTransactionGateway, FakeCoreGateway>();
builder.Services.AddSingleton<RegisterPaymentUseCase>();
builder.Services.AddSingleton<ListTransactionsUseCase>();

var app = builder.Build();

app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
    var error = context.Features.Get<IExceptionHandlerFeature>()?.Error;
    var (status, title) = error switch
    {
        DomainException => (StatusCodes.Status422UnprocessableEntity, "Transacción inválida"),
        CardNotFoundException => (StatusCodes.Status404NotFound, "Tarjeta no encontrada"),
        _ => (StatusCodes.Status500InternalServerError, "Error inesperado")
    };

    if (status == StatusCodes.Status500InternalServerError)
    {
        app.Logger.LogError("Error no controlado: {ErrorType}", error?.GetType().Name);
    }

    var detail = status == StatusCodes.Status500InternalServerError ? null : error?.Message;
    await Results.Problem(title: title, detail: detail, statusCode: status).ExecuteAsync(context);
}));
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/v1/cards", async (ICardTransactionRepository repository, CancellationToken ct) =>
    Results.Ok(await repository.ListCardsAsync(ct)));

app.MapGet("/v1/cards/{cardId:guid}/transactions",
    async (Guid cardId, int? limit, ListTransactionsUseCase useCase, CancellationToken ct) =>
    {
        var items = await useCase.ExecuteAsync(cardId, limit, ct);
        return Results.Ok(items.Select(TransactionResponse.From));
    });

app.MapPost("/v1/card-payments",
    async (CreatePaymentRequest body, HttpRequest request, RegisterPaymentUseCase useCase, CancellationToken ct) =>
    {
        var key = request.Headers["Idempotency-Key"].ToString();
        var outcome = await useCase.ExecuteAsync(
            new RegisterPaymentCommand(body.CardId, body.Amount, body.Currency, key), ct);
        var response = TransactionResponse.From(outcome.Transaction);
        return outcome.Replayed
            ? Results.Ok(response)
            : Results.Created($"/v1/cards/{response.CardId}/transactions", response);
    });

app.Run();

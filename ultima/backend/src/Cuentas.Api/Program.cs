using Cuentas.Api;
using Cuentas.Application;
using Cuentas.Domain;
using Cuentas.Infrastructure;

const string ConnectionVariable = "CUENTAS_DB";
const int DefaultLimit = 20;
const int MaxLimit = 100;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration[ConnectionVariable]
    ?? throw new InvalidOperationException($"Falta la variable de entorno {ConnectionVariable}.");

builder.Services.AddCuentasInfrastructure(connectionString);
builder.Services.AddScoped<TransferService>();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var api = app.MapGroup("/api");

api.MapGet("/accounts", async (IAccountRepository repo, CancellationToken ct) =>
    Results.Ok((await repo.ListAsync(ct)).Select(a => a.ToDto())));

api.MapGet("/accounts/{id:long}/transactions",
    async (long id, int? limit, IAccountRepository repo, CancellationToken ct) =>
    {
        _ = await repo.FindAsync(id, ct)
            ?? throw new DomainException(ErrorCodes.AccountNotFound, "No existe la cuenta.");
        var size = Math.Clamp(limit ?? DefaultLimit, 1, MaxLimit);
        return Results.Ok((await repo.ListEntriesAsync(id, size, ct)).Select(e => e.ToDto()));
    });

api.MapPost("/transfers",
    async (TransferRequest body, HttpRequest request, TransferService service, CancellationToken ct) =>
    {
        var key = request.Headers["Idempotency-Key"].ToString();
        var command = new TransferCommand(
            body.SourceAccountId,
            body.TargetAccountId,
            Mapping.ParseAmount(body.Amount),
            body.Description,
            key);

        var result = await service.ExecuteAsync(command, ct);
        var dto = result.ToDto();
        return result.Replayed
            ? Results.Ok(dto)
            : Results.Created($"/api/transfers/{result.TransferId}", dto);
    });

app.Run();

using Accounts.Application;
using Accounts.Infrastructure;
using Accounts.Security;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration["ACCOUNTS_DB_CONNECTION"]
    ?? throw new InvalidOperationException("Falta la variable de entorno ACCOUNTS_DB_CONNECTION.");

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddScoped<IAccountRepository, PgAccountRepository>();
builder.Services.AddScoped<AccountQueryService>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "UP" }));

var accounts = app.MapGroup("/api/v1/accounts");

accounts.MapGet("", async (
    HttpContext ctx,
    IHostEnvironment env,
    AccountQueryService service,
    CancellationToken ct,
    int page = 1,
    int size = 20) =>
{
    if (!CustomerResolver.TryResolve(ctx, env, out var customerId))
    {
        return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "No autenticado");
    }

    try
    {
        return Results.Ok(await service.ListAsync(customerId, page, size, ct));
    }
    catch (InvalidQueryException ex)
    {
        return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Consulta inválida", detail: ex.Message);
    }
});

accounts.MapGet("{id:guid}", async (
    Guid id,
    HttpContext ctx,
    IHostEnvironment env,
    AccountQueryService service,
    CancellationToken ct) =>
{
    if (!CustomerResolver.TryResolve(ctx, env, out var customerId))
    {
        return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "No autenticado");
    }

    var account = await service.GetAsync(customerId, id, ct);
    return account is null
        ? Results.Problem(statusCode: StatusCodes.Status404NotFound, title: "Cuenta no encontrada")
        : Results.Ok(account);
});

app.Run();

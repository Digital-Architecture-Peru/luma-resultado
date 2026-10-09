using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Payments.Api;
using Payments.Application;
using Payments.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Payments")
    ?? throw new InvalidOperationException("Falta la variable de entorno ConnectionStrings__Payments.");

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddSingleton(builder.Configuration.GetSection("Payments").Get<PaymentOptions>() ?? new PaymentOptions());
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddSingleton<IPaymentGateway, FakePaymentGateway>();
builder.Services.AddScoped<PaymentService>();

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/accounts", async (PaymentService service, CancellationToken ct) =>
{
    var accounts = await service.ListAccountsAsync(ct);
    return Results.Ok(accounts.Select(AccountResponse.From));
});

app.MapPost("/api/payments", async (
    CreatePaymentRequest body,
    [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
    PaymentService service,
    CancellationToken ct) =>
{
    var payment = await service.CreateAsync(body.ToDomain(), idempotencyKey, ct);
    return Results.Created($"/api/payments/{payment.Id}", PaymentResponse.From(payment));
});

app.MapGet("/api/payments/{id:guid}", async (Guid id, PaymentService service, CancellationToken ct) =>
{
    var payment = await service.GetPaymentAsync(id, ct);
    return payment is null ? Results.NotFound() : Results.Ok(PaymentResponse.From(payment));
});

app.Run();

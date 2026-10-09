using Npgsql;
using Payments.Api;
using Payments.Application;
using Payments.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

// Persistencia: PostgreSQL si hay cadena en el entorno; si no, memoria (solo desarrollo local).
var connectionString = builder.Configuration["PAYMENTS_DB_CONNECTION"];
if (string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddSingleton<IPaymentRepository, InMemoryPaymentRepository>();
}
else
{
    builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
    builder.Services.AddSingleton<IPaymentRepository, PgPaymentRepository>();
}

builder.Services.AddSingleton<IPaymentProcessor, FakePaymentProcessor>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton(new PaymentPolicy(builder.Configuration.GetValue("Payments:MaxAmount", 10000m)));
builder.Services.AddScoped<CreatePaymentHandler>();
builder.Services.AddScoped<PaymentQueryService>();

var origins = (builder.Configuration["Cors:Origins"] ?? "http://localhost:4200")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(origins)
    .WithHeaders("Content-Type", "Idempotency-Key", "X-Customer-Id")
    .WithMethods("GET", "POST")));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

using Payments.Api.Endpoints;
using Payments.Application;
using Payments.Domain;
using Payments.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var store = builder.Configuration["PAYMENTS_STORE"] ?? "memory";
var connection = builder.Configuration["PAYMENTS_DB_CONNECTION"];
var origins = (builder.Configuration["ALLOWED_ORIGINS"] ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddSingleton<IPaymentQueryRepository>(_ => RepositoryFactory.Create(store, connection));
builder.Services.AddSingleton<PaymentQueryService>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(origins).WithMethods("GET").WithHeaders("X-Customer-Id", "Accept")));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapPaymentsEndpoints();

app.Run();

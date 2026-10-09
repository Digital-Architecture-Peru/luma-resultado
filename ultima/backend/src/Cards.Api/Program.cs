using Cards.Api;
using Cards.Application;
using Cards.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Cards")
    ?? throw new InvalidOperationException("Falta la variable de entorno ConnectionStrings__Cards.");
var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:4200";

builder.Services.AddControllers();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddCardsInfrastructure(connectionString);
builder.Services.AddScoped<PayCardHandler>();
builder.Services.AddScoped<CardQueries>();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins(allowedOrigin)
    .WithMethods("GET", "POST")
    .WithHeaders("Content-Type", "Idempotency-Key")));

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

using Cards.Api.Endpoints;
using Cards.Application;
using Cards.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Punto único de composición. Con ConnectionStrings__Cards se usa PostgreSQL; si falta, datos ficticios en memoria.
var connectionString = builder.Configuration.GetConnectionString("Cards");
if (string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddSingleton<ICardRepository, InMemoryCardRepository>();
}
else
{
    builder.Services.AddSingleton<ICardRepository>(_ => new PostgresCardRepository(connectionString));
}

builder.Services.AddScoped<ICardQueryService, CardQueryService>();
builder.Services.AddProblemDetails();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy => policy.WithOrigins(allowedOrigins).WithMethods("GET").AllowAnyHeader()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapCardEndpoints();

app.Run();

public partial class Program
{
}

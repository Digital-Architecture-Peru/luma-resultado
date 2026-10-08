using Cards.Api;
using Cards.Application;
using Cards.Infrastructure;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Cards")
    ?? throw new InvalidOperationException("Falta la variable de entorno ConnectionStrings__Cards.");

var allowedOrigins = (builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:4200")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddSingleton(NpgsqlDataSource.Create(connectionString));
builder.Services.AddScoped<ICardQueryRepository, NpgsqlCardQueryRepository>();
builder.Services.AddScoped<CardQueryService>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins(allowedOrigins).WithMethods("GET").AllowAnyHeader()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapCardsEndpoints();

app.Run();

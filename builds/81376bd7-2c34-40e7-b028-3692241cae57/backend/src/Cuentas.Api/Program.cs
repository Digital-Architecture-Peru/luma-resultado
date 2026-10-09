using Cuentas.Api.Endpoints;
using Cuentas.Application;
using Cuentas.Infrastructure;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var conexion = Environment.GetEnvironmentVariable("CUENTAS_DB_CONNECTION")
    ?? throw new InvalidOperationException("Defina la variable de entorno CUENTAS_DB_CONNECTION.");
var origen = Environment.GetEnvironmentVariable("CORS_ORIGIN") ?? "http://localhost:5173";

builder.Services.AddSingleton(NpgsqlDataSource.Create(conexion));
builder.Services.AddScoped<ICuentaRepository, PgCuentaRepository>();
builder.Services.AddScoped<ConsultarCuentasService>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(origen).WithHeaders("X-Cliente-Id", "Content-Type").WithMethods("GET")));

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapCuentas();

app.Run();

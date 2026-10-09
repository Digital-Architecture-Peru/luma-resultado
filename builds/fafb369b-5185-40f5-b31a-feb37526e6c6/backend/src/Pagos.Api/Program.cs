using Npgsql;
using Pagos.Api;
using Pagos.Api.Endpoints;
using Pagos.Application;
using Pagos.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var origenCors = Environment.GetEnvironmentVariable("CORS_ORIGIN") ?? "http://localhost:4200";
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origenCors).WithMethods("GET").AllowAnyHeader()));
builder.Services.AddProblemDetails();

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<NpgsqlDataSource>(_ =>
{
    var cadena = Environment.GetEnvironmentVariable("PAGOS_DB_CONNECTION");
    if (string.IsNullOrWhiteSpace(cadena))
        throw new InvalidOperationException("Falta la variable de entorno PAGOS_DB_CONNECTION.");
    return NpgsqlDataSource.Create(cadena);
});
builder.Services.AddSingleton<IPagoRepository, PagoRepository>();
builder.Services.AddSingleton<ICurrentCustomer, StubCurrentCustomer>();
builder.Services.AddScoped<ConsultarPagosHandler>();
builder.Services.AddScoped<ObtenerPagoHandler>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapPagosEndpoints();

app.Run();

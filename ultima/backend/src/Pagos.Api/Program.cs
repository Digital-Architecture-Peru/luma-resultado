using Npgsql;
using Pagos.Application;
using Pagos.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var cadenaConexion = builder.Configuration["PAGOS_DB_CONNECTION"]
    ?? throw new InvalidOperationException("Falta la variable de entorno PAGOS_DB_CONNECTION.");
var origenCors = builder.Configuration["PAGOS_CORS_ORIGIN"] ?? "http://localhost:5173";
var clienteStub = builder.Configuration["PAGOS_CLIENTE_ID"] ?? "CLI-0001";

builder.Services.AddSingleton(NpgsqlDataSource.Create(cadenaConexion));
builder.Services.AddSingleton<IPagosRepository, PgPagosRepository>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ConsultaPagosService>();
// Stub: la autenticación está fuera de alcance (hipótesis H2).
builder.Services.AddSingleton<IClienteActual>(new ClienteStub(clienteStub));
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origenCors).WithMethods("GET").AllowAnyHeader()));

var app = builder.Build();
app.UseCors();

app.Use(async (contexto, siguiente) =>
{
    try
    {
        await siguiente();
    }
    catch (ConsultaInvalidaException ex)
    {
        contexto.Response.StatusCode = StatusCodes.Status400BadRequest;
        await Results.Problem(title: "Consulta inválida", detail: ex.Message, statusCode: 400)
            .ExecuteAsync(contexto);
    }
    catch (Exception ex)
    {
        // No se registran montos ni cuentas; solo el tipo de excepción.
        app.Logger.LogError("Error no controlado: {Tipo}", ex.GetType().Name);
        await Results.Problem(title: "Error interno", statusCode: 500).ExecuteAsync(contexto);
    }
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var v1 = app.MapGroup("/api/v1/pagos");

v1.MapGet("", async (
    ConsultaPagosService servicio, IClienteActual cliente,
    DateTimeOffset? desde, DateTimeOffset? hasta, string? estado,
    int? page, int? pageSize, CancellationToken ct) =>
    Results.Ok(await servicio.ConsultarAsync(cliente.ClienteId, desde, hasta, estado, page, pageSize, ct)));

v1.MapGet("{id:guid}", async (
    Guid id, ConsultaPagosService servicio, IClienteActual cliente, CancellationToken ct) =>
{
    var pago = await servicio.ObtenerAsync(cliente.ClienteId, id, ct);
    return pago is null
        ? Results.Problem(title: "Pago no encontrado", statusCode: 404)
        : Results.Ok(pago);
});

app.Run();

internal sealed record ClienteStub(string ClienteId) : IClienteActual;

public partial class Program { }

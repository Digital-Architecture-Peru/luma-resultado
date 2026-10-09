using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Pagos.Application;
using Pagos.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var cadenaConexion = builder.Configuration.GetConnectionString("Pagos");
var origenPermitido = builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";

builder.Services.AddSingleton(TimeProvider.System);
if (string.IsNullOrWhiteSpace(cadenaConexion))
{
    builder.Services.AddSingleton<IPagoRepository>(sp =>
        InMemoryPagoRepository.CrearDemo(sp.GetRequiredService<TimeProvider>()));
}
else
{
    builder.Services.AddSingleton(NpgsqlDataSource.Create(cadenaConexion));
    builder.Services.AddSingleton<IPagoRepository, PgPagoRepository>();
}

builder.Services.AddSingleton<ConsultaPagosService>();
builder.Services.AddCors(opciones => opciones.AddDefaultPolicy(politica =>
    politica.WithOrigins(origenPermitido).WithHeaders("X-Cliente-Id", "Content-Type").WithMethods("GET")));

var app = builder.Build();
var logger = app.Logger;

// Convierte errores de validación en ProblemDetails 400 sin exponer excepciones internas.
app.Use(async (contexto, siguiente) =>
{
    try
    {
        await siguiente(contexto);
    }
    catch (ConsultaInvalidaException ex)
    {
        contexto.Response.StatusCode = StatusCodes.Status400BadRequest;
        var problema = new ProblemDetails
        {
            Title = "Consulta inválida",
            Status = StatusCodes.Status400BadRequest,
            Detail = ex.Message
        };
        await contexto.Response.WriteAsJsonAsync(problema, (System.Text.Json.JsonSerializerOptions?)null, "application/problem+json");
    }
    catch (Exception ex) when (ex is not OperationCanceledException)
    {
        logger.LogError(ex, "Error no controlado en {Path}", contexto.Request.Path.Value);
        contexto.Response.StatusCode = StatusCodes.Status500InternalServerError;
        var problema = new ProblemDetails
        {
            Title = "Error interno",
            Status = StatusCodes.Status500InternalServerError
        };
        await contexto.Response.WriteAsJsonAsync(problema, (System.Text.Json.JsonSerializerOptions?)null, "application/problem+json");
    }
});

app.UseCors();

// H2: la autenticación real queda fuera de alcance; el cliente llega por un header stub.
static Guid LeerCliente(HttpContext contexto)
{
    if (contexto.Request.Headers.TryGetValue("X-Cliente-Id", out var valor) && Guid.TryParse(valor.ToString(), out var id))
    {
        return id;
    }

    throw new ConsultaInvalidaException("Header X-Cliente-Id ausente o inválido.");
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/v1/pagos", async (
    HttpContext contexto,
    ConsultaPagosService servicio,
    DateTimeOffset? desde,
    DateTimeOffset? hasta,
    string? estado,
    int? page,
    int? pageSize,
    CancellationToken ct) =>
{
    var resultado = await servicio.ListarAsync(LeerCliente(contexto), desde, hasta, estado, page, pageSize, ct);
    return Results.Ok(resultado);
});

app.MapGet("/api/v1/pagos/{id:guid}", async (HttpContext contexto, ConsultaPagosService servicio, Guid id, CancellationToken ct) =>
{
    var pago = await servicio.ObtenerAsync(LeerCliente(contexto), id, ct);
    return pago is null
        ? Results.Problem(title: "Pago no encontrado", statusCode: StatusCodes.Status404NotFound)
        : Results.Ok(pago);
});

app.Run();

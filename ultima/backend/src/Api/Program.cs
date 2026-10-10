using Tarjetas.Notificaciones.Api;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var conexion = builder.Configuration["NOTIF_DB_CONNECTION"]
    ?? throw new InvalidOperationException("Falta la variable de entorno NOTIF_DB_CONNECTION.");
var origenCors = builder.Configuration["CORS_ORIGIN"] ?? "http://localhost:4200";

builder.Services.AddInfrastructure(conexion);
builder.Services.AddScoped<NotificacionService>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(origenCors)
    .WithHeaders("X-Cliente-Id", "Content-Type")
    .WithMethods("GET", "PATCH", "PUT")));

var app = builder.Build();

app.UseCors();

// Manejo centralizado de errores en formato ProblemDetails (RFC 7807).
app.Use(async (ctx, next) =>
{
    try
    {
        await next();
    }
    catch (ValidacionException ex)
    {
        await Problema(ctx, StatusCodes.Status400BadRequest, "Solicitud inválida", ex.Message);
    }
    catch (NoEncontradoException ex)
    {
        await Problema(ctx, StatusCodes.Status404NotFound, "No encontrado", ex.Message);
    }
    catch (Exception ex)
    {
        app.Logger.LogError("Error no controlado: {Tipo}", ex.GetType().Name);
        await Problema(ctx, StatusCodes.Status500InternalServerError, "Error interno", "Ocurrió un error inesperado.");
    }
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var v1 = app.MapGroup("/api/v1");

v1.MapGet("/tarjetas/{tarjetaRef}/notificaciones", async (
    HttpContext http, string tarjetaRef, bool? leida, int? page, int? size,
    NotificacionService servicio, CancellationToken ct) =>
{
    var pagina = await servicio.ListarAsync(ClienteId(http), tarjetaRef, leida, page ?? 1, size ?? 20, ct);
    return Results.Ok(new PaginaDto(
        pagina.Items.Select(NotificacionDto.Desde).ToList(), pagina.Total, pagina.Page, pagina.Size));
});

v1.MapPatch("/notificaciones/{id:guid}/lectura", async (
    HttpContext http, Guid id, NotificacionService servicio, CancellationToken ct) =>
{
    await servicio.MarcarLeidaAsync(ClienteId(http), id, ct);
    return Results.NoContent();
});

v1.MapGet("/tarjetas/{tarjetaRef}/preferencias", async (
    HttpContext http, string tarjetaRef, NotificacionService servicio, CancellationToken ct) =>
{
    var prefs = await servicio.ObtenerPreferenciasAsync(ClienteId(http), tarjetaRef, ct);
    return Results.Ok(new PreferenciasDto(prefs.Select(PreferenciaDto.Desde).ToList()));
});

v1.MapPut("/tarjetas/{tarjetaRef}/preferencias", async (
    HttpContext http, string tarjetaRef, PreferenciasDto cuerpo,
    NotificacionService servicio, CancellationToken ct) =>
{
    var cliente = ClienteId(http);
    var entrada = (cuerpo.Preferencias ?? []).Select(p => p.ADominio(cliente, tarjetaRef)).ToList();
    var guardadas = await servicio.GuardarPreferenciasAsync(cliente, tarjetaRef, entrada, ct);
    return Results.Ok(new PreferenciasDto(guardadas.Select(PreferenciaDto.Desde).ToList()));
});

app.Run();

// El cliente se simula con un header; la autenticación real la aporta el gateway de Banca por Internet.
static string ClienteId(HttpContext http) =>
    http.Request.Headers["X-Cliente-Id"].ToString() is { Length: > 0 } id
        ? id
        : throw new ValidacionException("Falta el header X-Cliente-Id.");

static Task Problema(HttpContext ctx, int status, string titulo, string detalle) =>
    Results.Problem(detail: detalle, statusCode: status, title: titulo).ExecuteAsync(ctx);

public partial class Program;

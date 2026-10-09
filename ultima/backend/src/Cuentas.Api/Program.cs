using Cuentas.Api;
using Cuentas.Application;
using Cuentas.Domain;
using Cuentas.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// ConnectionStrings__Cuentas se entrega por variable de entorno (nunca en el repositorio).
var connectionString = builder.Configuration.GetConnectionString("Cuentas")
    ?? throw new InvalidOperationException("Falta la variable de entorno ConnectionStrings__Cuentas.");

var origenCors = builder.Configuration["CORS_ORIGIN"] ?? "http://localhost:4200";

builder.Services.AddProblemDetails();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(origenCors).WithHeaders("Content-Type", "Idempotency-Key").WithMethods("GET", "POST")));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddInfraestructura(connectionString);
builder.Services.AddScoped<RealizarTransferencia>();
builder.Services.AddScoped<ConsultarCuentas>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { estado = "ok" }));

var v1 = app.MapGroup("/api/v1");

v1.MapGet("/cuentas", async (ConsultarCuentas consulta, CancellationToken ct) =>
    Results.Ok(await consulta.EjecutarAsync(TitularSimulado.Id, ct)));

v1.MapPost("/transferencias", async (
    TransferenciaRequest request,
    HttpContext http,
    RealizarTransferencia caso,
    ILogger<Program> log,
    CancellationToken ct) =>
{
    var errores = request.Validar(http.Request.Headers["Idempotency-Key"].ToString());
    if (errores.Count > 0)
        return Results.ValidationProblem(errores, statusCode: StatusCodes.Status400BadRequest);

    var comando = new RealizarTransferenciaComando(
        TitularSimulado.Id, request.OrigenId, request.DestinoId, request.Monto,
        request.Moneda!.ToUpperInvariant(), request.Concepto?.Trim(),
        http.Request.Headers["Idempotency-Key"].ToString());

    try
    {
        var resultado = await caso.EjecutarAsync(comando, ct);
        return resultado.Repetido
            ? Results.Ok(resultado.Comprobante)
            : Results.Created($"/api/v1/transferencias/{resultado.Comprobante.Id}", resultado.Comprobante);
    }
    catch (ReglaNegocioException ex)
    {
        log.LogInformation("Transferencia rechazada: {Codigo}", ex.Codigo);
        return Results.Problem(title: "Regla de negocio incumplida", detail: ex.Message,
            statusCode: StatusCodes.Status422UnprocessableEntity,
            extensions: new Dictionary<string, object?> { ["codigo"] = ex.Codigo });
    }
    catch (CuentaNoEncontradaException ex)
    {
        return Results.Problem(title: "Cuenta no encontrada", detail: ex.Message,
            statusCode: StatusCodes.Status404NotFound);
    }
    catch (ConflictoIdempotenciaException ex)
    {
        return Results.Problem(title: "Conflicto de idempotencia", detail: ex.Message,
            statusCode: StatusCodes.Status409Conflict);
    }
});

app.Run();

public partial class Program;

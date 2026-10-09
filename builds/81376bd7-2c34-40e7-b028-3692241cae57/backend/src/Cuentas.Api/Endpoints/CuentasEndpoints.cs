using Cuentas.Application;

namespace Cuentas.Api.Endpoints;

public static class CuentasEndpoints
{
    public const string HeaderCliente = "X-Cliente-Id";

    public static IEndpointRouteBuilder MapCuentas(this IEndpointRouteBuilder app)
    {
        var grupo = app.MapGroup("/api/v1/cuentas");

        // ADVERTENCIA: X-Cliente-Id es una simulación de identidad. Reemplazar por el IdP del banco.
        grupo.MapGet("", async (HttpRequest req, ConsultarCuentasService servicio, CancellationToken ct) =>
        {
            if (!TryLeerCliente(req, out var clienteId))
                return ClienteInvalido();
            return Results.Ok(await servicio.ListarAsync(clienteId, ct));
        });

        grupo.MapGet("{id:guid}", async (Guid id, HttpRequest req, ConsultarCuentasService servicio, CancellationToken ct) =>
        {
            if (!TryLeerCliente(req, out var clienteId))
                return ClienteInvalido();
            var cuenta = await servicio.ObtenerAsync(clienteId, id, ct);
            return cuenta is null
                ? Results.Problem(title: "Cuenta no encontrada", statusCode: StatusCodes.Status404NotFound,
                    detail: "La cuenta solicitada no existe.")
                : Results.Ok(cuenta);
        });

        return app;
    }

    private static bool TryLeerCliente(HttpRequest req, out Guid clienteId) =>
        Guid.TryParse(req.Headers[HeaderCliente].ToString(), out clienteId) && clienteId != Guid.Empty;

    private static IResult ClienteInvalido() =>
        Results.Problem(title: "Cliente no identificado", statusCode: StatusCodes.Status400BadRequest,
            detail: $"Falta o es inválido el header {HeaderCliente}.");
}

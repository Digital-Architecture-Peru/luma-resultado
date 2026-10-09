using Pagos.Application;

namespace Pagos.Api.Endpoints;

public static class PagosEndpoints
{
    public static IEndpointRouteBuilder MapPagosEndpoints(this IEndpointRouteBuilder app)
    {
        var grupo = app.MapGroup("/api/v1/pagos");

        grupo.MapGet("/", ConsultarAsync);
        grupo.MapGet("/{id:guid}", ObtenerAsync);

        return app;
    }

    private static async Task<IResult> ConsultarAsync(
        ConsultarPagosHandler handler,
        DateTimeOffset? desde,
        DateTimeOffset? hasta,
        string? estado,
        CancellationToken ct,
        int page = 1,
        int size = 20)
    {
        try
        {
            var resultado = await handler.HandleAsync(new ConsultarPagosQuery(desde, hasta, estado, page, size), ct);
            return Results.Ok(resultado);
        }
        catch (ConsultaInvalidaException ex)
        {
            return Results.ValidationProblem(
                new Dictionary<string, string[]> { ["consulta"] = ex.Errores.ToArray() },
                title: "Parámetros de consulta inválidos",
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    private static async Task<IResult> ObtenerAsync(Guid id, ObtenerPagoHandler handler, CancellationToken ct)
    {
        var pago = await handler.HandleAsync(id, ct);
        return pago is null
            ? Results.Problem(title: "Pago no encontrado", statusCode: StatusCodes.Status404NotFound)
            : Results.Ok(pago);
    }
}

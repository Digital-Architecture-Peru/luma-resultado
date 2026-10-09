using Payments.Application;

namespace Payments.Api.Endpoints;

public static class PaymentsEndpoints
{
    public const string CustomerHeader = "X-Customer-Id";

    public static IEndpointRouteBuilder MapPaymentsEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/payments");

        // H1: X-Customer-Id simula la identidad de la banca anfitriona; NO es seguro.
        group.MapGet("/", async (
            HttpContext http,
            PaymentQueryService service,
            DateTimeOffset? from,
            DateTimeOffset? to,
            string? status,
            int? page,
            int? pageSize,
            CancellationToken ct) =>
        {
            if (!TryGetCustomerId(http, out var customerId)) return Unauthorized();
            try
            {
                var result = await service.SearchAsync(
                    customerId, from, to, status, page ?? 1, pageSize ?? 20, ct);
                return Results.Ok(result);
            }
            catch (QueryValidationException ex)
            {
                return Results.Problem(title: "Consulta inválida", detail: ex.Message, statusCode: 400);
            }
        });

        group.MapGet("/{id:guid}", async (
            Guid id, HttpContext http, PaymentQueryService service, CancellationToken ct) =>
        {
            if (!TryGetCustomerId(http, out var customerId)) return Unauthorized();
            var payment = await service.GetAsync(customerId, id, ct);
            return payment is null
                ? Results.Problem(title: "Pago no encontrado", statusCode: 404)
                : Results.Ok(payment);
        });

        return routes;
    }

    private static bool TryGetCustomerId(HttpContext http, out Guid customerId)
    {
        customerId = Guid.Empty;
        return http.Request.Headers.TryGetValue(CustomerHeader, out var raw)
               && Guid.TryParse(raw.ToString(), out customerId);
    }

    private static IResult Unauthorized() =>
        Results.Problem(title: "No autenticado", detail: "Falta o es inválido el header X-Customer-Id.", statusCode: 401);
}

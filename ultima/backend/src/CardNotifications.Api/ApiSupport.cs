using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using CardNotifications.Domain;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CardNotifications.Api;

public interface ICurrentCustomer
{
    /// <returns>Identificador del cliente o null si no hay identidad válida.</returns>
    string? Resolve(HttpContext context);
}

/// <summary>
/// Toma el cliente de los claims del token (sub). SOLO en Development acepta el stub
/// de la cabecera X-Customer-Id (o un cliente demo); fuera de Development responde 401.
/// </summary>
public sealed class CurrentCustomer(IHostEnvironment environment) : ICurrentCustomer
{
    private const string DevHeader = "X-Customer-Id";
    private const string DevDefault = "CUST-DEMO-001";
    private static readonly Regex IdPattern = new(@"^[A-Za-z0-9\-]{1,40}\z", RegexOptions.Compiled);

    public string? Resolve(HttpContext context)
    {
        var claim = context.User.FindFirst("sub")?.Value ?? context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (claim is not null && IdPattern.IsMatch(claim)) return claim;

        if (!environment.IsDevelopment()) return null;

        var header = context.Request.Headers[DevHeader].ToString();
        if (string.IsNullOrEmpty(header)) return DevDefault;
        return IdPattern.IsMatch(header) ? header : null;
    }
}

/// <summary>Errores uniformes en formato problem+json; no expone detalles internos.</summary>
public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var (status, title, detail) = exception switch
        {
            DomainValidationException v => (StatusCodes.Status422UnprocessableEntity, "Datos inválidos", string.Join("; ", v.Errors)),
            NotFoundException => (StatusCodes.Status404NotFound, "No encontrado", "El recurso solicitado no existe."),
            _ => (StatusCodes.Status500InternalServerError, "Error interno", "Ocurrió un error inesperado.")
        };

        if (status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Error no controlado");

        context.Response.StatusCode = status;
        var problem = new ProblemDetails { Status = status, Title = title, Detail = detail };
        await context.Response.WriteAsJsonAsync(problem, (JsonSerializerOptions?)null, "application/problem+json", ct);
        return true;
    }
}

/// <summary>Propaga X-Correlation-Id (o genera uno) y lo agrega al ámbito de logs.</summary>
public sealed class CorrelationIdMiddleware(RequestDelegate next, ILogger<CorrelationIdMiddleware> logger)
{
    private const string HeaderName = "X-Correlation-Id";
    private static readonly Regex SafeId = new(@"^[A-Za-z0-9\-]{1,64}\z", RegexOptions.Compiled);

    public async Task InvokeAsync(HttpContext context)
    {
        var incoming = context.Request.Headers[HeaderName].ToString();
        var correlationId = SafeId.IsMatch(incoming) ? incoming : Guid.NewGuid().ToString("N");
        context.Response.Headers[HeaderName] = correlationId;

        using (logger.BeginScope(new Dictionary<string, object> { ["CorrelationId"] = correlationId }))
        {
            await next(context);
        }
    }
}

using Payments.Application;
using Payments.Domain;

namespace Payments.Api;

/// <summary>Traduce errores de dominio a ProblemDetails sin exponer excepciones internas.</summary>
public sealed class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            await Write(context, StatusCodes.Status400BadRequest, "Solicitud inválida", ex.Message);
        }
        catch (IdempotencyConflictException ex)
        {
            await Write(context, StatusCodes.Status409Conflict, "Conflicto de idempotencia", ex.Message);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogError(ex, "Error no controlado. TraceId={TraceId}", context.TraceIdentifier);
            await Write(context, StatusCodes.Status500InternalServerError, "Error interno", "Ocurrió un error inesperado.");
        }
    }

    private static Task Write(HttpContext context, int status, string title, string detail) =>
        Results.Problem(detail: detail, statusCode: status, title: title).ExecuteAsync(context);
}

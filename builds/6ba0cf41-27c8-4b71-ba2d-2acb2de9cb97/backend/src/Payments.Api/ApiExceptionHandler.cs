using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Payments.Application;
using Payments.Domain;

namespace Payments.Api;

/// <summary>Traduce excepciones de la aplicación a respuestas problem+json sin exponer detalles internos.</summary>
public sealed class ApiExceptionHandler : IExceptionHandler
{
    private readonly ILogger<ApiExceptionHandler> _logger;

    public ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) => _logger = logger;

    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        ProblemDetails? problem = exception switch
        {
            RequestValidationException v => new ValidationProblemDetails(v.Errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Solicitud inválida",
                Detail = v.Message
            },
            DomainException d => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Regla de negocio incumplida",
                Detail = d.Message
            },
            DuplicateIdempotencyKeyException d => new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Pago duplicado",
                Detail = d.Message
            },
            _ => null
        };

        if (problem is null)
        {
            _logger.LogError(exception, "Error no controlado en {Path}", context.Request.Path);
            return false;
        }

        context.Response.StatusCode = problem.Status!.Value;
        await context.Response.WriteAsJsonAsync(problem, (System.Text.Json.JsonSerializerOptions?)null,
            "application/problem+json", ct);
        return true;
    }
}

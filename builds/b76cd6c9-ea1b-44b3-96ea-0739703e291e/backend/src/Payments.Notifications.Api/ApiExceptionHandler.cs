using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Payments.Notifications.Application;

namespace Payments.Notifications.Api;

/// <summary>Traduce excepciones a ProblemDetails sin exponer detalles internos.</summary>
public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var (status, title, detail) = exception switch
        {
            NotificationNotFoundException e => (StatusCodes.Status404NotFound, "Notificación no encontrada", e.Message),
            InvalidRequestException e => (StatusCodes.Status400BadRequest, "Solicitud inválida", e.Message),
            _ => (StatusCodes.Status500InternalServerError, "Error interno", "Ocurrió un error inesperado.")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Error no controlado en {Path}", context.Request.Path);
        }

        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(
            new ProblemDetails { Status = status, Title = title, Detail = detail }, ct);
        return true;
    }
}

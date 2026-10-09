using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Tarjetas.Notificaciones.Application;

namespace Tarjetas.Notificaciones.Api;

public sealed class DemoCurrentCustomer(string customerId) : ICurrentCustomer
{
    public string CustomerId { get; } = customerId;
}

/// <summary>Convierte excepciones de aplicación en problem+json sin exponer detalles internos.</summary>
public sealed class ApiExceptionHandler(IProblemDetailsService problemDetails, ILogger<ApiExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var (status, title) = exception switch
        {
            InvalidRequestException => (StatusCodes.Status400BadRequest, "Solicitud inválida"),
            ResourceNotFoundException => (StatusCodes.Status404NotFound, "No encontrado"),
            _ => (StatusCodes.Status500InternalServerError, "Error interno")
        };

        if (status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Error no controlado");

        context.Response.StatusCode = status;
        return await problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = context,
            ProblemDetails = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = status == StatusCodes.Status500InternalServerError ? null : exception.Message
            }
        });
    }
}

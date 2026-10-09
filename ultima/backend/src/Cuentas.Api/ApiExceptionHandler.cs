using Cuentas.Domain;
using Microsoft.AspNetCore.Diagnostics;

namespace Cuentas.Api;

/// <summary>Traduce errores a ProblemDetails (RFC 7807) sin exponer excepciones internas.</summary>
internal sealed class ApiExceptionHandler : IExceptionHandler
{
    private readonly ILogger<ApiExceptionHandler> _logger;

    public ApiExceptionHandler(ILogger<ApiExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        int status;
        string title;
        string detail;

        if (exception is DomainException domain)
        {
            status = StatusFor(domain.Code);
            title = domain.Code;
            detail = domain.Message;
        }
        else
        {
            _logger.LogError(exception, "Error no controlado en {Path}", context.Request.Path.Value);
            status = StatusCodes.Status500InternalServerError;
            title = "INTERNAL_ERROR";
            detail = "Ocurrió un error interno.";
        }

        context.Response.StatusCode = status;
        await Results.Problem(detail: detail, statusCode: status, title: title).ExecuteAsync(context);
        return true;
    }

    internal static int StatusFor(string code) => code switch
    {
        ErrorCodes.Validation => StatusCodes.Status400BadRequest,
        ErrorCodes.AccountNotFound => StatusCodes.Status404NotFound,
        ErrorCodes.DuplicateRequest => StatusCodes.Status409Conflict,
        _ => StatusCodes.Status422UnprocessableEntity
    };
}

using System.Text.Json;
using Cards.Application;

namespace Cards.Api;

/// <summary>Traduce excepciones de la aplicación a respuestas problem+json uniformes.</summary>
public sealed class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (RequestValidationException ex)
        {
            await Write(context, StatusCodes.Status400BadRequest, "Solicitud inválida", ex.Message, ex.Errors);
        }
        catch (NotFoundException ex)
        {
            await Write(context, StatusCodes.Status404NotFound, "No encontrado", ex.Message);
        }
        catch (ConflictException ex)
        {
            await Write(context, StatusCodes.Status409Conflict, "Conflicto", ex.Message);
        }
        catch (PaymentDeclinedException ex)
        {
            await Write(context, StatusCodes.Status422UnprocessableEntity, "Pago rechazado", ex.Message);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogError(ex, "Error no controlado en {Path}", context.Request.Path.Value);
            await Write(context, StatusCodes.Status500InternalServerError, "Error interno",
                "Ocurrió un error inesperado.");
        }
    }

    private static async Task Write(
        HttpContext context, int status, string title, string detail,
        IReadOnlyDictionary<string, string[]>? errors = null)
    {
        if (context.Response.HasStarted)
            return;

        context.Response.Clear();
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        var body = new { type = "about:blank", title, status, detail, errors };
        await context.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOptions));
    }
}

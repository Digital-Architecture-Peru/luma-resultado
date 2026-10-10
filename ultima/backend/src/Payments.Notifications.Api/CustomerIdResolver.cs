using Payments.Notifications.Application;

namespace Payments.Notifications.Api;

/// <summary>
/// Resuelve el cliente de la petición. Solo desarrollo: header ficticio X-Customer-Id.
/// En producción debe derivarse del token de autenticación (fuera de alcance).
/// </summary>
public static class CustomerIdResolver
{
    public const string HeaderName = "X-Customer-Id";
    private const int MaxLength = 64;

    public static string Resolve(HttpRequest request)
    {
        var value = request.Headers[HeaderName].ToString().Trim();
        if (value.Length == 0 || value.Length > MaxLength)
            throw new InvalidRequestException($"Falta o es inválido el header {HeaderName}.");
        return value;
    }
}

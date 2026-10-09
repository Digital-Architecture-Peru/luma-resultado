namespace Payments.Application;

public sealed class IdempotencyConflictException : Exception
{
    public IdempotencyConflictException(string key)
        : base($"La clave de idempotencia '{key}' ya se usó con una solicitud distinta.") { }
}

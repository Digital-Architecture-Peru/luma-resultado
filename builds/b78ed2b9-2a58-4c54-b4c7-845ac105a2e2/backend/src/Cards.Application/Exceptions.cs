namespace Cards.Application;

public sealed class RequestValidationException(IReadOnlyDictionary<string, string[]> errors)
    : Exception("La solicitud no es válida.")
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;

    public static RequestValidationException For(string field, string message) =>
        new(new Dictionary<string, string[]> { [field] = [message] });
}

public sealed class NotFoundException(string message) : Exception(message);

public sealed class ConflictException(string message) : Exception(message);

public sealed class PaymentDeclinedException(string message) : Exception(message);

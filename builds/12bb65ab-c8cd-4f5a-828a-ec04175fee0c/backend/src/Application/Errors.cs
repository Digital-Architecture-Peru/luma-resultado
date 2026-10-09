namespace Tarjetas.Notificaciones.Application;

public sealed class InvalidRequestException(string message) : Exception(message);

public sealed class ResourceNotFoundException(string message) : Exception(message);

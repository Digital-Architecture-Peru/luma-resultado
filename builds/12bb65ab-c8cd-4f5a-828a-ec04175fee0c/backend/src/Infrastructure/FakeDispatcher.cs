using Microsoft.Extensions.Logging;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

/// <summary>
/// Despachador ficticio: la integración con email/SMS/push está sin definir.
/// Solo registra id y canal; nunca el título ni el cuerpo de la notificación.
/// </summary>
public sealed class FakeDispatcher(ILogger<FakeDispatcher> logger) : INotificationDispatcher
{
    public Task DispatchAsync(Notification notification, Channel channel, CancellationToken ct = default)
    {
        logger.LogInformation("Notificación {NotificationId} despachada (simulado) por {Channel}", notification.Id, channel);
        return Task.CompletedTask;
    }
}

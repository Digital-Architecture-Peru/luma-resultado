using CardNotifications.Application;
using CardNotifications.Domain;
using Microsoft.Extensions.Logging;

namespace CardNotifications.Infrastructure;

/// <summary>Fuente de eventos ficticia: la integración real con el core de tarjetas no está definida.</summary>
public sealed class FakeCardEventSource : ICardEventSource
{
    public Task<IReadOnlyList<CardEvent>> PullAsync(CancellationToken ct)
    {
        IReadOnlyList<CardEvent> events = new[]
        {
            new CardEvent("CUST-DEMO-001", "card_demo_01", "1234", NotificationType.PurchaseApproved, "S/ 45.90 en Comercio Demo"),
            new CardEvent("CUST-DEMO-001", "card_demo_02", "9876", NotificationType.LimitChanged, "nuevo límite S/ 5,000.00")
        };
        return Task.FromResult(events);
    }
}

/// <summary>Despachador ficticio: solo registra el canal y el tipo, nunca el contenido.</summary>
public sealed class FakeChannelDispatcher(ILogger<FakeChannelDispatcher> logger) : IChannelDispatcher
{
    public Task DispatchAsync(Channel channel, Notification notification, CancellationToken ct)
    {
        logger.LogInformation("Despacho simulado por {Channel} del evento {Type}", channel, notification.Type);
        return Task.CompletedTask;
    }
}

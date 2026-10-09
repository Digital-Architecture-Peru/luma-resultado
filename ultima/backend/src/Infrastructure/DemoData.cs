using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

/// <summary>Datos ficticios para la demo en memoria.</summary>
public static class DemoData
{
    public static IReadOnlyList<Notification> For(string customerId, DateTimeOffset now) =>
    [
        Make(customerId, "evt-demo-001", "tok-demo-4821", "4821", NotificationType.Compra,
            "Compra aprobada", "Compra de 45.90 USD en COMERCIO DEMO.", now.AddMinutes(-15)),
        Make(customerId, "evt-demo-002", "tok-demo-4821", "4821", NotificationType.PagoMinimo,
            "Pago mínimo próximo", "Tu pago mínimo vence en 3 días.", now.AddHours(-5)),
        Make(customerId, "evt-demo-003", "tok-demo-7730", "7730", NotificationType.Vencimiento,
            "Tarjeta por vencer", "Tu tarjeta vence el próximo mes.", now.AddDays(-1)),
        Make(customerId, "evt-demo-004", "tok-demo-7730", "7730", NotificationType.Bloqueo,
            "Tarjeta bloqueada", "Bloqueaste temporalmente tu tarjeta.", now.AddDays(-2))
    ];

    private static Notification Make(
        string customerId, string eventId, string cardRef, string last4,
        NotificationType type, string title, string body, DateTimeOffset createdAt) =>
        new(Guid.NewGuid(), customerId, cardRef, last4, type, title, body, eventId, createdAt, null);
}

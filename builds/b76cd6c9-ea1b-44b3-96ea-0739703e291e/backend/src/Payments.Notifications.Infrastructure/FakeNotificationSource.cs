using Payments.Notifications.Application;
using Payments.Notifications.Domain;

namespace Payments.Notifications.Infrastructure;

/// <summary>Fuente simulada con datos ficticios, hasta definir la integración real de eventos de pago.</summary>
public sealed class FakeNotificationSource(TimeProvider clock) : INotificationSource
{
    public const string DemoCustomerId = "CUST-001";

    public IReadOnlyList<PaymentNotification> GetNotifications()
    {
        var now = clock.GetUtcNow();
        return
        [
            Build(1, NotificationType.PaymentDone, "Pago realizado", "Tu pago de servicios fue procesado.", 120.50m, "PEN", "****1234", now.AddHours(-2)),
            Build(2, NotificationType.PaymentRejected, "Pago rechazado", "Fondos insuficientes en la cuenta origen.", 1250.00m, "USD", "****5678", now.AddHours(-26)),
            Build(3, NotificationType.PaymentDue, "Pago por vencer", "Tu cuota vence en 3 días.", 340.00m, "PEN", "****9012", now.AddDays(-2)),
            Build(4, NotificationType.PaymentDone, "Pago realizado", "Transferencia entre cuentas completada.", 80.00m, "PEN", "****3456", now.AddDays(-5)),
        ];
    }

    private static PaymentNotification Build(
        int n, NotificationType type, string title, string body, decimal amount, string currency, string paymentRef, DateTimeOffset createdAt) =>
        new(new Guid($"00000000-0000-0000-0000-{n:D12}"), DemoCustomerId, paymentRef, type, title, body, amount, currency, createdAt);
}

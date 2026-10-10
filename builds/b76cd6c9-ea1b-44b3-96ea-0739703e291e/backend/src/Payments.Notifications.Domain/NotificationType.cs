namespace Payments.Notifications.Domain;

public enum NotificationType
{
    PaymentDone,
    PaymentRejected,
    PaymentDue
}

/// <summary>Conversión entre el enum y el código persistido/expuesto (PAYMENT_DONE, ...).</summary>
public static class NotificationTypeCodes
{
    private static readonly Dictionary<NotificationType, string> Codes = new()
    {
        [NotificationType.PaymentDone] = "PAYMENT_DONE",
        [NotificationType.PaymentRejected] = "PAYMENT_REJECTED",
        [NotificationType.PaymentDue] = "PAYMENT_DUE"
    };

    public static string ToCode(this NotificationType type) => Codes[type];

    public static NotificationType Parse(string code)
    {
        foreach (var (type, value) in Codes)
        {
            if (value == code)
            {
                return type;
            }
        }

        throw new ArgumentException($"Tipo de notificación desconocido: '{code}'.", nameof(code));
    }
}

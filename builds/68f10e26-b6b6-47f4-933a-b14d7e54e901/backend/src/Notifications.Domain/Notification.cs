using System.Globalization;

namespace Notifications.Domain;

public enum NotificationType { PaymentCompleted, PaymentRejected, PaymentScheduled }

public enum NotificationStatus { Unread, Read }

/// <summary>Error de regla de negocio o de entrada inválida; la API lo traduce a 422.</summary>
public sealed class DomainValidationException : Exception
{
    public DomainValidationException(string message) : base(message) { }
}

public static class NotificationCodes
{
    public static string ToCode(this NotificationType type) => type switch
    {
        NotificationType.PaymentCompleted => "PAYMENT_COMPLETED",
        NotificationType.PaymentRejected => "PAYMENT_REJECTED",
        NotificationType.PaymentScheduled => "PAYMENT_SCHEDULED",
        _ => throw new ArgumentOutOfRangeException(nameof(type)),
    };

    public static bool TryParseType(string? code, out NotificationType type)
    {
        switch (code)
        {
            case "PAYMENT_COMPLETED": type = NotificationType.PaymentCompleted; return true;
            case "PAYMENT_REJECTED": type = NotificationType.PaymentRejected; return true;
            case "PAYMENT_SCHEDULED": type = NotificationType.PaymentScheduled; return true;
            default: type = default; return false;
        }
    }

    public static string ToCode(this NotificationStatus status) =>
        status == NotificationStatus.Unread ? "UNREAD" : "READ";

    public static bool TryParseStatus(string? code, out NotificationStatus status)
    {
        switch (code)
        {
            case "UNREAD": status = NotificationStatus.Unread; return true;
            case "READ": status = NotificationStatus.Read; return true;
            default: status = default; return false;
        }
    }
}

public sealed record Notification(
    Guid Id,
    string CustomerId,
    string PaymentEventId,
    NotificationType Type,
    NotificationStatus Status,
    string Title,
    string Message,
    decimal Amount,
    string Currency,
    string MaskedAccount,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public Notification MarkRead(DateTimeOffset now) =>
        Status == NotificationStatus.Read ? this : this with { Status = NotificationStatus.Read, ReadAt = now };
}

public static class AccountMasker
{
    private const int VisibleDigits = 4;

    public static string Mask(string? account)
    {
        var digits = new string((account ?? string.Empty).Where(char.IsDigit).ToArray());
        if (digits.Length < VisibleDigits)
            throw new DomainValidationException("La cuenta debe tener al menos 4 dígitos.");
        return "****" + digits[^VisibleDigits..];
    }
}

public static class NotificationFactory
{
    public static Notification FromPayment(
        Guid id, string customerId, string paymentEventId, NotificationType type,
        decimal amount, string currency, string maskedAccount, DateTimeOffset now)
    {
        var money = $"{amount.ToString("N2", CultureInfo.InvariantCulture)} {currency}";
        var (title, message) = type switch
        {
            NotificationType.PaymentCompleted => ("Pago realizado", $"Tu pago de {money} desde la cuenta {maskedAccount} fue procesado."),
            NotificationType.PaymentRejected => ("Pago rechazado", $"No pudimos procesar tu pago de {money} desde la cuenta {maskedAccount}."),
            NotificationType.PaymentScheduled => ("Pago programado", $"Programamos tu pago de {money} desde la cuenta {maskedAccount}."),
            _ => throw new ArgumentOutOfRangeException(nameof(type)),
        };
        return new Notification(id, customerId, paymentEventId, type, NotificationStatus.Unread,
            title, message, amount, currency, maskedAccount, now, null);
    }
}

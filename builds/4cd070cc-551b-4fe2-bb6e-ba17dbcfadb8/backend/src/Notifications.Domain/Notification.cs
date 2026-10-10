namespace Notifications.Domain;

public enum NotificationType
{
    Deposit,
    Withdrawal,
    LowBalance
}

public static class NotificationTypeCodes
{
    public static string ToCode(NotificationType type) => type switch
    {
        NotificationType.Deposit => "DEPOSIT",
        NotificationType.Withdrawal => "WITHDRAWAL",
        NotificationType.LowBalance => "LOW_BALANCE",
        _ => throw new ArgumentOutOfRangeException(nameof(type), type, "Tipo de notificación desconocido.")
    };

    public static NotificationType Parse(string code) => code switch
    {
        "DEPOSIT" => NotificationType.Deposit,
        "WITHDRAWAL" => NotificationType.Withdrawal,
        "LOW_BALANCE" => NotificationType.LowBalance,
        _ => throw new ArgumentException($"Código de notificación desconocido: {code}", nameof(code))
    };
}

public sealed record Notification(
    Guid Id,
    string CustomerId,
    string AccountId,
    NotificationType Type,
    string Title,
    string Message,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public bool IsRead => ReadAt.HasValue;

    /// <summary>Idempotente: si ya estaba leída conserva la fecha original.</summary>
    public Notification MarkRead(DateTimeOffset now) => IsRead ? this : this with { ReadAt = now };
}

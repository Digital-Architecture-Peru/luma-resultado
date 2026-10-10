namespace Notifications.Domain;

public enum NotificationType
{
    Deposit,
    Withdrawal,
    LowBalance,
    Statement
}

public static class NotificationTypeCodes
{
    public static string ToCode(this NotificationType type) => type switch
    {
        NotificationType.Deposit => "DEPOSIT",
        NotificationType.Withdrawal => "WITHDRAWAL",
        NotificationType.LowBalance => "LOW_BALANCE",
        NotificationType.Statement => "STATEMENT",
        _ => throw new ArgumentOutOfRangeException(nameof(type), type, "Tipo de notificación desconocido")
    };

    public static bool TryParse(string? code, out NotificationType type)
    {
        switch (code)
        {
            case "DEPOSIT": type = NotificationType.Deposit; return true;
            case "WITHDRAWAL": type = NotificationType.Withdrawal; return true;
            case "LOW_BALANCE": type = NotificationType.LowBalance; return true;
            case "STATEMENT": type = NotificationType.Statement; return true;
            default: type = default; return false;
        }
    }

    public static IReadOnlyList<NotificationType> All { get; } = Enum.GetValues<NotificationType>();
}

public sealed record Notification(
    Guid Id,
    string AccountId,
    string CustomerId,
    NotificationType Type,
    string Title,
    string Message,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public bool IsRead => ReadAt is not null;

    public Notification MarkRead(DateTimeOffset at) => IsRead ? this : this with { ReadAt = at };
}

public sealed record NotificationPreference(NotificationType Type, bool Enabled);

public static class AccountMask
{
    private const int VisibleDigits = 4;

    public static string Mask(string accountId)
    {
        if (string.IsNullOrWhiteSpace(accountId) || accountId.Length <= VisibleDigits)
        {
            return "****";
        }

        return "****" + accountId[^VisibleDigits..];
    }
}

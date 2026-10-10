using Payments.Notifications.Domain;

namespace Payments.Notifications.Application;

public sealed record NotificationDto(
    Guid Id,
    string PaymentRef,
    string Type,
    string Title,
    string Body,
    decimal Amount,
    string Currency,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public static NotificationDto From(PaymentNotification n) => new(
        n.Id, n.PaymentRef, n.Type.ToCode(), n.Title, n.Body, n.Amount, n.Currency, n.CreatedAt, n.ReadAt);
}

public sealed record UnreadCountDto(int Count);

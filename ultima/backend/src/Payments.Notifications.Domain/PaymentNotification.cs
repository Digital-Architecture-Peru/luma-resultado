using System.Text.RegularExpressions;

namespace Payments.Notifications.Domain;

public sealed partial class PaymentNotification
{
    public PaymentNotification(
        Guid id,
        string customerId,
        string paymentRef,
        NotificationType type,
        string title,
        string body,
        decimal amount,
        string currency,
        DateTimeOffset createdAt,
        DateTimeOffset? readAt = null)
    {
        if (string.IsNullOrWhiteSpace(customerId))
            throw new ArgumentException("El cliente es obligatorio.", nameof(customerId));
        if (!MaskedRefPattern().IsMatch(paymentRef ?? string.Empty))
            throw new ArgumentException("La referencia de pago debe estar enmascarada (****1234).", nameof(paymentRef));
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("El título es obligatorio.", nameof(title));
        if (amount < 0)
            throw new ArgumentException("El monto no puede ser negativo.", nameof(amount));
        if (!CurrencyPattern().IsMatch(currency ?? string.Empty))
            throw new ArgumentException("La moneda debe ser ISO-4217 (tres letras mayúsculas).", nameof(currency));

        Id = id;
        CustomerId = customerId;
        PaymentRef = paymentRef!;
        Type = type;
        Title = title;
        Body = body ?? string.Empty;
        Amount = amount;
        Currency = currency!;
        CreatedAt = createdAt;
        ReadAt = readAt;
    }

    public Guid Id { get; }
    public string CustomerId { get; }
    public string PaymentRef { get; }
    public NotificationType Type { get; }
    public string Title { get; }
    public string Body { get; }
    public decimal Amount { get; }
    public string Currency { get; }
    public DateTimeOffset CreatedAt { get; }
    public DateTimeOffset? ReadAt { get; private set; }

    public bool IsRead => ReadAt.HasValue;

    /// <summary>Marca como leída. Es idempotente: conserva la primera fecha de lectura.</summary>
    /// <returns>true si cambió el estado.</returns>
    public bool MarkAsRead(DateTimeOffset now)
    {
        if (IsRead)
        {
            return false;
        }

        ReadAt = now;
        return true;
    }

    [GeneratedRegex(@"^\*{4}\d{4}$")]
    private static partial Regex MaskedRefPattern();

    [GeneratedRegex(@"^[A-Z]{3}$")]
    private static partial Regex CurrencyPattern();
}

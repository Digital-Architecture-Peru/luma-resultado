namespace Tarjetas.Notificaciones.Domain;

public enum NotificationType
{
    Compra,
    Bloqueo,
    Vencimiento,
    PagoMinimo
}

public enum Channel
{
    InApp,
    Email,
    Sms,
    Push
}

/// <summary>
/// Notificación de tarjeta. Nunca contiene el PAN: solo un token (CardRef) y los últimos 4 dígitos.
/// </summary>
public sealed record Notification(
    Guid Id,
    string CustomerId,
    string CardRef,
    string CardLast4,
    NotificationType Type,
    string Title,
    string Body,
    string EventId,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    public bool IsRead => ReadAt.HasValue;
}

public sealed record Preference(NotificationType Type, Channel Channel, bool Enabled);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);

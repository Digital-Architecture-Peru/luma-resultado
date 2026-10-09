using System.Text.RegularExpressions;

namespace CardNotifications.Domain;

public enum NotificationType
{
    PurchaseApproved,
    PurchaseDeclined,
    CardBlocked,
    CardUnblocked,
    LimitChanged,
    ExpiryUpcoming
}

public enum Severity { Info, Warning, Critical }

public enum Channel { InApp, Email, Sms, Push }

/// <summary>Error de validación de reglas de negocio (se traduce a HTTP 422).</summary>
public sealed class DomainValidationException : Exception
{
    public DomainValidationException(IReadOnlyList<string> errors)
        : base(string.Join("; ", errors)) => Errors = errors;

    public IReadOnlyList<string> Errors { get; }
}

public sealed class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

/// <summary>Evento de tarjeta recibido desde la integración (sin definir). Nunca contiene el PAN.</summary>
public sealed record CardEvent(
    string CustomerId,
    string CardRef,
    string CardLast4,
    NotificationType Type,
    string? Detail);

public sealed record Notification(
    Guid Id,
    string CustomerId,
    string CardRef,
    string CardLast4,
    NotificationType Type,
    string Title,
    string Body,
    Severity Severity,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadAt)
{
    private const int MaxBody = 500;
    private const int MaxDetail = 200;
    private static readonly Regex Last4Pattern = new(@"^[0-9]{4}\z", RegexOptions.Compiled);

    public bool IsRead => ReadAt.HasValue;

    public static Notification FromEvent(CardEvent e, Guid id, DateTimeOffset now)
    {
        Validate(e);

        var tail = $"tarjeta terminada en {e.CardLast4}";
        var detail = string.IsNullOrWhiteSpace(e.Detail) ? "" : $" ({e.Detail.Trim()})";

        var (title, body, severity) = e.Type switch
        {
            NotificationType.PurchaseApproved =>
                ("Compra aprobada", $"Se aprobó una compra{detail} con la {tail}.", Severity.Info),
            NotificationType.PurchaseDeclined =>
                ("Compra rechazada", $"Se rechazó un intento de compra{detail} con la {tail}.", Severity.Warning),
            NotificationType.CardBlocked =>
                ("Tarjeta bloqueada", $"Tu {tail} fue bloqueada{detail}.", Severity.Critical),
            NotificationType.CardUnblocked =>
                ("Tarjeta desbloqueada", $"Tu {tail} fue desbloqueada{detail}.", Severity.Info),
            NotificationType.LimitChanged =>
                ("Cambio de límite", $"Se modificó el límite de tu {tail}{detail}.", Severity.Info),
            NotificationType.ExpiryUpcoming =>
                ("Tarjeta por vencer", $"Tu {tail} está próxima a vencer{detail}.", Severity.Warning),
            _ => throw new DomainValidationException(new[] { "Tipo de evento no soportado." })
        };

        var safeBody = body.Length > MaxBody ? body[..MaxBody] : body;
        return new Notification(id, e.CustomerId, e.CardRef, e.CardLast4, e.Type, title, safeBody, severity, now, null);
    }

    private static void Validate(CardEvent e)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(e.CustomerId)) errors.Add("customerId es obligatorio.");
        if (string.IsNullOrWhiteSpace(e.CardRef)) errors.Add("cardRef es obligatorio.");
        if (e.CardLast4 is null || !Last4Pattern.IsMatch(e.CardLast4)) errors.Add("cardLast4 debe tener 4 dígitos.");
        if (e.Detail is { Length: > MaxDetail }) errors.Add($"detail no puede superar {MaxDetail} caracteres.");
        if (errors.Count > 0) throw new DomainValidationException(errors);
    }
}

public sealed record Preference(NotificationType EventType, Channel Channel, bool Enabled);

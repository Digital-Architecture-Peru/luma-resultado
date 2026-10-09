namespace Cards.Domain;

public enum CardStatus
{
    Active,
    Blocked,
    Cancelled
}

/// <summary>
/// Tarjeta de un cliente. Nunca contiene el PAN completo ni el CVV: solo el PAN enmascarado y los últimos 4 dígitos.
/// </summary>
public sealed record Card(
    Guid Id,
    string CustomerId,
    string ProductName,
    string Brand,
    string MaskedPan,
    string Last4,
    CardStatus Status,
    decimal CreditLimit,
    decimal AvailableBalance,
    string Currency,
    string Expiry);

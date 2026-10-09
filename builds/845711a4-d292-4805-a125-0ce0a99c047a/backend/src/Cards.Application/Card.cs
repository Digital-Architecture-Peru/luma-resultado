namespace Cards.Application;

/// <summary>Tarjeta del dominio. Nunca contiene el PAN completo ni el CVV: solo los últimos 4 dígitos.</summary>
public sealed record Card(
    Guid Id,
    Guid CustomerId,
    string PanLast4,
    string Brand,
    string CardType,
    string Status,
    decimal CreditLimit,
    decimal AvailableBalance,
    string Currency,
    int ExpiryMonth,
    int ExpiryYear);

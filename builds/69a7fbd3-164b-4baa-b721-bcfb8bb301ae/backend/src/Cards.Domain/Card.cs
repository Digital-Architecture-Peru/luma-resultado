namespace Cards.Domain;

/// <summary>Tarjeta del cliente. Solo se conserva last4: el PAN completo nunca se almacena.</summary>
public sealed record Card(
    Guid Id,
    Guid CustomerId,
    string Last4,
    string Brand,
    string Product,
    CardStatus Status,
    decimal CreditLimit,
    decimal Available,
    string Currency,
    int ExpiryMonth,
    int ExpiryYear);

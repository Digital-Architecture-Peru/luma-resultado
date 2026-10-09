namespace Cards.Application;

/// <summary>Contrato público v1 de una tarjeta.</summary>
public sealed record CardDto(
    Guid Id,
    string MaskedNumber,
    string Brand,
    string Type,
    string Status,
    decimal CreditLimit,
    decimal AvailableBalance,
    string Currency,
    string Expiry);

namespace Cards.Application;

public sealed record CardSummary(
    Guid Id,
    string ProductName,
    string Brand,
    string MaskedPan,
    string Status,
    string Currency,
    decimal AvailableBalance);

public sealed record CardDetail(
    Guid Id,
    string ProductName,
    string Brand,
    string MaskedPan,
    string Status,
    string Currency,
    decimal AvailableBalance,
    decimal CreditLimit,
    string Expiry);

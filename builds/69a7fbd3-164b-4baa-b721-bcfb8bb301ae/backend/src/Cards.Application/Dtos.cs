namespace Cards.Application;

public sealed record CardDto(
    Guid Id,
    string MaskedPan,
    string Brand,
    string Product,
    string Status,
    decimal CreditLimit,
    decimal Available,
    string Currency,
    string Expiry);

public sealed record MovementDto(
    Guid Id,
    DateTimeOffset PostedAt,
    string Description,
    decimal Amount,
    string Currency);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int Size, int Total);

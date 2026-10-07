using CardsQuery.Api.Atoms;

namespace CardsQuery.Api.Molecules;

public sealed record CardSummaryDto(
    string Id,
    string MaskedNumber,
    string Type,
    string Status,
    Money AvailableBalance,
    string ExpiryDate);

public sealed record CardDetailDto(
    string Id,
    string HolderName,
    string MaskedNumber,
    string Type,
    string Status,
    Money CreditLimit,
    Money AvailableBalance,
    string ExpiryDate,
    bool ExpiresSoon);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);

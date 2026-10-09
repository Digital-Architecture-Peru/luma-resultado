namespace Accounts.Application;

public sealed record AccountDto(
    Guid Id,
    string MaskedNumber,
    string ProductType,
    string Currency,
    decimal AvailableBalance,
    decimal LedgerBalance,
    string Status,
    DateTimeOffset OpenedAt,
    DateTimeOffset UpdatedAt);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int Size, int Total);

public sealed class InvalidQueryException(string message) : Exception(message);

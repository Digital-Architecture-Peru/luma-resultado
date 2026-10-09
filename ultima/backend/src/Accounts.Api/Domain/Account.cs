namespace Accounts.Domain;

public enum AccountStatus
{
    Activa,
    Bloqueada,
    Cerrada
}

public sealed record Account(
    Guid Id,
    Guid CustomerId,
    string AccountNumber,
    string ProductType,
    string Currency,
    decimal AvailableBalance,
    decimal LedgerBalance,
    AccountStatus Status,
    DateTimeOffset OpenedAt,
    DateTimeOffset UpdatedAt);

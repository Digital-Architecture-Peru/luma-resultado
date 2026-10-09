using Accounts.Domain;

namespace Accounts.Application;

public static class AccountMasking
{
    private const int VisibleDigits = 4;

    public static string Mask(string accountNumber)
    {
        if (string.IsNullOrEmpty(accountNumber))
        {
            return string.Empty;
        }

        if (accountNumber.Length <= VisibleDigits)
        {
            return new string('*', accountNumber.Length);
        }

        return "****" + accountNumber[^VisibleDigits..];
    }
}

public sealed class AccountQueryService(IAccountRepository repository)
{
    public const int MaxPageSize = 50;

    public async Task<PagedResult<AccountDto>> ListAsync(Guid customerId, int page, int size, CancellationToken ct)
    {
        if (page < 1)
        {
            throw new InvalidQueryException("page debe ser mayor o igual a 1.");
        }

        if (size < 1 || size > MaxPageSize)
        {
            throw new InvalidQueryException($"size debe estar entre 1 y {MaxPageSize}.");
        }

        var result = await repository.ListByCustomerAsync(customerId, page, size, ct);
        var items = result.Items.Select(ToDto).ToList();
        return new PagedResult<AccountDto>(items, page, size, result.Total);
    }

    /// <summary>Devuelve null si la cuenta no existe o pertenece a otro cliente.</summary>
    public async Task<AccountDto?> GetAsync(Guid customerId, Guid accountId, CancellationToken ct)
    {
        var account = await repository.FindAsync(customerId, accountId, ct);
        return account is null ? null : ToDto(account);
    }

    private static AccountDto ToDto(Account a) => new(
        a.Id,
        AccountMasking.Mask(a.AccountNumber),
        a.ProductType,
        a.Currency,
        a.AvailableBalance,
        a.LedgerBalance,
        a.Status.ToString().ToUpperInvariant(),
        a.OpenedAt,
        a.UpdatedAt);
}

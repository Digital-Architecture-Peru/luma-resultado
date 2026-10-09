using Accounts.Application;
using Accounts.Domain;
using Xunit;

namespace Accounts.UnitTests;

public class AccountQueryServiceTests
{
    private static readonly Guid CustomerA = Guid.Parse("11111111-1111-4111-8111-111111111111");
    private static readonly Guid CustomerB = Guid.Parse("22222222-2222-4222-8222-222222222222");

    private sealed class FakeRepository(IEnumerable<Account> data) : IAccountRepository
    {
        private readonly List<Account> _data = data.ToList();

        public Task<AccountPage> ListByCustomerAsync(Guid customerId, int page, int size, CancellationToken ct)
        {
            var mine = _data.Where(a => a.CustomerId == customerId).ToList();
            var items = mine.Skip((page - 1) * size).Take(size).ToList();
            return Task.FromResult(new AccountPage(items, mine.Count));
        }

        public Task<Account?> FindAsync(Guid customerId, Guid accountId, CancellationToken ct) =>
            Task.FromResult(_data.FirstOrDefault(a => a.Id == accountId && a.CustomerId == customerId));
    }

    private static Account NewAccount(Guid customerId, string number) => new(
        Guid.NewGuid(), customerId, number, "AHORROS", "PEN", 100.50m, 120.50m,
        AccountStatus.Activa, DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2026-01-01T00:00:00Z"));

    private static AccountQueryService ServiceWith(params Account[] accounts) =>
        new(new FakeRepository(accounts));

    [Fact]
    public void Mask_GivenLongNumber_ShowsOnlyLastFourDigits()
    {
        Assert.Equal("****1234", AccountMasking.Mask("000100000012341234"));
    }

    [Fact]
    public void Mask_GivenShortNumber_HidesEverything()
    {
        Assert.Equal("***", AccountMasking.Mask("123"));
    }

    [Fact]
    public async Task List_GivenAccounts_ReturnsMaskedNumbersOnly()
    {
        var service = ServiceWith(NewAccount(CustomerA, "000100000012341234"));

        var result = await service.ListAsync(CustomerA, 1, 20, CancellationToken.None);

        var dto = Assert.Single(result.Items);
        Assert.Equal("****1234", dto.MaskedNumber);
        Assert.Equal("ACTIVA", dto.Status);
    }

    [Fact]
    public async Task List_GivenOtherCustomerAccounts_DoesNotLeakThem()
    {
        var service = ServiceWith(NewAccount(CustomerA, "1111111111"), NewAccount(CustomerB, "2222222222"));

        var result = await service.ListAsync(CustomerA, 1, 20, CancellationToken.None);

        Assert.Equal(1, result.Total);
        Assert.All(result.Items, i => Assert.EndsWith("1111", i.MaskedNumber));
    }

    [Fact]
    public async Task List_GivenPageSize_PaginatesAndKeepsTotal()
    {
        var accounts = Enumerable.Range(0, 5).Select(i => NewAccount(CustomerA, $"00000000{i:D4}")).ToArray();
        var service = ServiceWith(accounts);

        var result = await service.ListAsync(CustomerA, 3, 2, CancellationToken.None);

        Assert.Single(result.Items);
        Assert.Equal(5, result.Total);
        Assert.Equal(3, result.Page);
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(1, 0)]
    [InlineData(1, 51)]
    public async Task List_GivenInvalidPagination_Throws(int page, int size)
    {
        var service = ServiceWith();

        await Assert.ThrowsAsync<InvalidQueryException>(
            () => service.ListAsync(CustomerA, page, size, CancellationToken.None));
    }

    [Fact]
    public async Task Get_GivenOwnAccount_ReturnsDto()
    {
        var account = NewAccount(CustomerA, "000100000012341234");
        var service = ServiceWith(account);

        var dto = await service.GetAsync(CustomerA, account.Id, CancellationToken.None);

        Assert.NotNull(dto);
        Assert.Equal(account.Id, dto!.Id);
    }

    [Fact]
    public async Task Get_GivenOtherCustomersAccount_ReturnsNull()
    {
        var account = NewAccount(CustomerB, "2222222222");
        var service = ServiceWith(account);

        var dto = await service.GetAsync(CustomerA, account.Id, CancellationToken.None);

        Assert.Null(dto);
    }

    [Fact]
    public async Task Get_GivenUnknownId_ReturnsNull()
    {
        var service = ServiceWith();

        Assert.Null(await service.GetAsync(CustomerA, Guid.NewGuid(), CancellationToken.None));
    }
}

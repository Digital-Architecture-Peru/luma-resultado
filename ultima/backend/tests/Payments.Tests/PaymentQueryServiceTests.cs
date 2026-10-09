using Payments.Application;
using Payments.Infrastructure;
using Xunit;

namespace Payments.Tests;

public class PaymentQueryServiceTests
{
    private static readonly Guid Customer = InMemoryPaymentQueryRepository.DemoCustomerId;
    private readonly PaymentQueryService _service = new(new InMemoryPaymentQueryRepository());

    [Theory]
    [InlineData(0, 20)]
    [InlineData(1, 0)]
    [InlineData(1, 101)]
    public async Task GivenInvalidPaging_WhenSearch_ThenValidationException(int page, int pageSize)
    {
        await Assert.ThrowsAsync<QueryValidationException>(() =>
            _service.SearchAsync(Customer, null, null, null, page, pageSize, default));
    }

    [Fact]
    public async Task GivenFromAfterTo_WhenSearch_ThenValidationException()
    {
        var to = new DateTimeOffset(2026, 9, 1, 0, 0, 0, TimeSpan.Zero);

        await Assert.ThrowsAsync<QueryValidationException>(() =>
            _service.SearchAsync(Customer, to.AddDays(1), to, null, 1, 20, default));
    }

    [Fact]
    public async Task GivenUnknownStatus_WhenSearch_ThenValidationException()
    {
        await Assert.ThrowsAsync<QueryValidationException>(() =>
            _service.SearchAsync(Customer, null, null, "BOGUS", 1, 20, default));
    }

    [Fact]
    public async Task GivenLowercaseStatus_WhenSearch_ThenFiltersAndUppercasesStatus()
    {
        var result = await _service.SearchAsync(Customer, null, null, "completed", 1, 20, default);

        Assert.NotEmpty(result.Items);
        Assert.All(result.Items, p => Assert.Equal("COMPLETED", p.Status));
    }

    [Fact]
    public async Task GivenPayment_WhenMapped_ThenAmountIsDecimalStringAndAccountMasked()
    {
        var result = await _service.SearchAsync(Customer, null, null, null, 1, 20, default);

        Assert.All(result.Items, p =>
        {
            Assert.Matches(@"^\d+\.\d{2}$", p.Amount);
            Assert.StartsWith("****", p.AccountMasked);
        });
    }

    [Fact]
    public async Task GivenUnknownId_WhenGet_ThenNull()
    {
        var dto = await _service.GetAsync(Customer, Guid.NewGuid(), default);

        Assert.Null(dto);
    }
}

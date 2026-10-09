using Payments.Domain;
using Payments.Infrastructure;
using Xunit;

namespace Payments.Tests;

public class InMemoryRepositoryTests
{
    private readonly InMemoryPaymentQueryRepository _repo = new();

    private static PaymentFilter Filter(PaymentStatus? status = null, int page = 1, int size = 20) =>
        new(null, null, status, page, size);

    [Fact]
    public async Task GivenCustomer_WhenSearch_ThenOnlyOwnPaymentsReturned()
    {
        var result = await _repo.SearchAsync(InMemoryPaymentQueryRepository.DemoCustomerId, Filter(), default);

        Assert.Equal(8, result.Total);
        Assert.All(result.Items, p => Assert.Equal(InMemoryPaymentQueryRepository.DemoCustomerId, p.CustomerId));
    }

    [Fact]
    public async Task GivenOtherCustomersPaymentId_WhenFind_ThenNull()
    {
        var otherId = Guid.Parse("00000000-0000-0000-0000-000000000201");

        var found = await _repo.FindByIdAsync(InMemoryPaymentQueryRepository.DemoCustomerId, otherId, default);

        Assert.Null(found);
    }

    [Fact]
    public async Task GivenStatusFilter_WhenSearch_ThenOnlyThatStatus()
    {
        var result = await _repo.SearchAsync(
            InMemoryPaymentQueryRepository.DemoCustomerId, Filter(PaymentStatus.Rejected), default);

        Assert.NotEmpty(result.Items);
        Assert.All(result.Items, p => Assert.Equal(PaymentStatus.Rejected, p.Status));
    }

    [Fact]
    public async Task GivenDateRange_WhenSearch_ThenWithinRange()
    {
        var from = new DateTimeOffset(2026, 9, 5, 0, 0, 0, TimeSpan.Zero);
        var to = new DateTimeOffset(2026, 9, 12, 0, 0, 0, TimeSpan.Zero);
        var filter = new PaymentFilter(from, to, null, 1, 20);

        var result = await _repo.SearchAsync(InMemoryPaymentQueryRepository.DemoCustomerId, filter, default);

        Assert.Equal(2, result.Total);
        Assert.All(result.Items, p => Assert.InRange(p.PaidAt, from, to));
    }

    [Fact]
    public async Task GivenPageSize3_WhenSecondPage_ThenNewestFirstAndRemainingItems()
    {
        var first = await _repo.SearchAsync(InMemoryPaymentQueryRepository.DemoCustomerId, Filter(null, 1, 3), default);
        var second = await _repo.SearchAsync(InMemoryPaymentQueryRepository.DemoCustomerId, Filter(null, 2, 3), default);

        Assert.Equal(3, first.Items.Count);
        Assert.Equal(3, second.Items.Count);
        Assert.True(first.Items[^1].PaidAt > second.Items[0].PaidAt);
    }
}

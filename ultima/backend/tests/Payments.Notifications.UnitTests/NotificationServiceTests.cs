using Payments.Notifications.Application;
using Payments.Notifications.Infrastructure;
using Xunit;

namespace Payments.Notifications.UnitTests;

public class NotificationServiceTests
{
    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }

    private static readonly DateTimeOffset Now = new(2026, 1, 10, 12, 0, 0, TimeSpan.Zero);
    private const string Customer = FakeNotificationSource.DemoCustomerId;

    private static NotificationService CreateService()
    {
        var clock = new FixedClock(Now);
        var repository = new InMemoryNotificationRepository(new FakeNotificationSource(clock));
        return new NotificationService(repository, clock);
    }

    [Fact]
    public async Task GivenAllStatus_WhenListed_ThenReturnsNewestFirst()
    {
        var result = await CreateService().ListAsync(Customer, "all", 1, 20, CancellationToken.None);

        Assert.Equal(4, result.Total);
        Assert.Equal(result.Items.OrderByDescending(i => i.CreatedAt).Select(i => i.Id), result.Items.Select(i => i.Id));
    }

    [Fact]
    public async Task GivenPageSize_WhenListed_ThenPaginates()
    {
        var result = await CreateService().ListAsync(Customer, "all", 2, 3, CancellationToken.None);

        Assert.Single(result.Items);
        Assert.Equal(4, result.Total);
    }

    [Fact]
    public async Task GivenOtherCustomer_WhenListed_ThenReturnsNothing()
    {
        var result = await CreateService().ListAsync("CUST-999", "all", 1, 20, CancellationToken.None);

        Assert.Empty(result.Items);
    }

    [Fact]
    public async Task GivenUnread_WhenMarkedAsRead_ThenCountDecreasesAndFilterExcludesIt()
    {
        var service = CreateService();
        var first = (await service.ListAsync(Customer, "unread", 1, 20, CancellationToken.None)).Items[0];

        var updated = await service.MarkAsReadAsync(Customer, first.Id, CancellationToken.None);

        Assert.Equal(Now, updated.ReadAt);
        Assert.Equal(3, (await service.GetUnreadCountAsync(Customer, CancellationToken.None)).Count);
        var unread = await service.ListAsync(Customer, "unread", 1, 20, CancellationToken.None);
        Assert.DoesNotContain(unread.Items, i => i.Id == first.Id);
    }

    [Fact]
    public async Task GivenNotificationOfAnotherCustomer_WhenMarked_ThenNotFound()
    {
        var service = CreateService();
        var id = (await service.ListAsync(Customer, "all", 1, 1, CancellationToken.None)).Items[0].Id;

        await Assert.ThrowsAsync<NotificationNotFoundException>(
            () => service.MarkAsReadAsync("CUST-999", id, CancellationToken.None));
    }

    [Theory]
    [InlineData("other", 1, 20)]
    [InlineData("all", 0, 20)]
    [InlineData("all", 1, 0)]
    [InlineData("all", 1, 101)]
    public async Task GivenInvalidParameters_WhenListed_ThenThrowsInvalidRequest(string status, int page, int size)
    {
        await Assert.ThrowsAsync<InvalidRequestException>(
            () => CreateService().ListAsync(Customer, status, page, size, CancellationToken.None));
    }

    [Fact]
    public async Task GivenBlankCustomer_WhenCountingUnread_ThenThrowsInvalidRequest()
    {
        await Assert.ThrowsAsync<InvalidRequestException>(
            () => CreateService().GetUnreadCountAsync(" ", CancellationToken.None));
    }
}

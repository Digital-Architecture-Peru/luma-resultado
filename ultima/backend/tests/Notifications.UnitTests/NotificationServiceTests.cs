using Notifications.Application;
using Notifications.Domain;

namespace Notifications.UnitTests;

public sealed class FixedClock(DateTimeOffset now) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => now;
}

public class NotificationServiceTests
{
    private const string Customer = "CUST-001";
    private const string Account = "ACC-001";
    private static readonly DateTimeOffset Now = new(2026, 10, 9, 12, 0, 0, TimeSpan.Zero);

    private readonly FakeNotificationRepository _repo = new();
    private readonly NotificationService _service;

    public NotificationServiceTests() => _service = new NotificationService(_repo, new FixedClock(Now));

    private Notification Add(string customer = Customer, int minutesAgo = 0, DateTimeOffset? readAt = null)
    {
        var n = new Notification(Guid.NewGuid(), customer, Account, NotificationType.Deposit,
            "Depósito recibido", "Cuenta ****1234", Now.AddMinutes(-minutesAgo), readAt);
        _repo.Store.Add(n);
        return n;
    }

    [Fact]
    public async Task GivenUnreadNotification_WhenMarkRead_ThenStoresReadDate()
    {
        var n = Add();

        var found = await _service.MarkReadAsync(Customer, n.Id);

        Assert.True(found);
        Assert.Equal(Now, _repo.Store[0].ReadAt);
    }

    [Fact]
    public async Task GivenReadNotification_WhenMarkReadAgain_ThenIsIdempotent()
    {
        var original = Now.AddDays(-1);
        var n = Add(readAt: original);

        var found = await _service.MarkReadAsync(Customer, n.Id);

        Assert.True(found);
        Assert.Equal(0, _repo.SaveCalls);
        Assert.Equal(original, _repo.Store[0].ReadAt);
    }

    [Fact]
    public async Task GivenOtherCustomersNotification_WhenMarkRead_ThenNotFoundAndUnchanged()
    {
        var n = Add(customer: "CUST-999");

        var found = await _service.MarkReadAsync(Customer, n.Id);

        Assert.False(found);
        Assert.Null(_repo.Store[0].ReadAt);
    }

    [Fact]
    public async Task GivenMixedNotifications_WhenCountUnread_ThenCountsOnlyOwnUnread()
    {
        Add();
        Add(readAt: Now);
        Add(customer: "CUST-999");

        Assert.Equal(1, await _service.UnreadCountAsync(Customer, Account));
    }

    [Fact]
    public async Task GivenManyNotifications_WhenListSecondPage_ThenReturnsSliceAndTotal()
    {
        for (var i = 0; i < 5; i++) Add(minutesAgo: i);

        var result = await _service.ListAsync(Customer, Account, "all", 2, 2);

        Assert.Equal(5, result.Total);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(Now.AddMinutes(-2), result.Items[0].CreatedAt);
    }

    [Fact]
    public async Task GivenUnreadFilter_WhenList_ThenExcludesRead()
    {
        Add();
        Add(readAt: Now);

        var result = await _service.ListAsync(Customer, Account, "unread", 1, 20);

        Assert.Single(result.Items);
        Assert.False(result.Items[0].Read);
        Assert.Equal("DEPOSIT", result.Items[0].Type);
    }

    [Theory]
    [InlineData(0, 20, "all")]
    [InlineData(1, 0, "all")]
    [InlineData(1, 101, "all")]
    [InlineData(1, 20, "other")]
    public async Task GivenInvalidParameters_WhenList_ThenThrowsInvalidRequest(int page, int size, string status)
    {
        await Assert.ThrowsAsync<InvalidRequestException>(() => _service.ListAsync(Customer, Account, status, page, size));
    }

    [Fact]
    public async Task GivenBlankCustomer_WhenList_ThenThrowsInvalidRequest()
    {
        await Assert.ThrowsAsync<InvalidRequestException>(() => _service.ListAsync(" ", Account, null, 1, 20));
    }

    [Fact]
    public void GivenTypeCodes_WhenRoundTrip_ThenSameType()
    {
        foreach (var type in Enum.GetValues<NotificationType>())
            Assert.Equal(type, NotificationTypeCodes.Parse(NotificationTypeCodes.ToCode(type)));
    }
}

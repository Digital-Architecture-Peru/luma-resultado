using Notifications.Application;
using Notifications.Domain;
using Xunit;

namespace Notifications.UnitTests;

public sealed class NotificationServiceTests
{
    private const string Customer = "CUST-0001";
    private const string Account = "10020030041234";
    private static readonly DateTimeOffset Now = new(2026, 10, 9, 12, 0, 0, TimeSpan.Zero);

    private readonly InMemoryNotificationRepository _repository = new();
    private readonly NotificationService _service;

    public NotificationServiceTests()
    {
        _service = new NotificationService(_repository, new FixedClock(Now));
    }

    private Notification Add(NotificationType type, int minutesAgo, bool read = false, string customer = Customer)
    {
        var notification = new Notification(
            Guid.NewGuid(), Account, customer, type, $"Título {type}", "Mensaje ficticio",
            Now.AddMinutes(-minutesAgo), read ? Now : null);
        _repository.Items.Add(notification);
        return notification;
    }

    [Fact]
    public async Task GivenNotifications_WhenListing_ThenMasksAccountAndOrdersNewestFirst()
    {
        Add(NotificationType.Deposit, 60);
        Add(NotificationType.Withdrawal, 5);

        var result = await _service.ListAsync(Customer, Account, false, CancellationToken.None);

        Assert.Equal(new[] { "WITHDRAWAL", "DEPOSIT" }, result.Select(n => n.Type).ToArray());
        Assert.All(result, n => Assert.Equal("****1234", n.AccountMasked));
    }

    [Fact]
    public async Task GivenUnreadNotification_WhenMarkedRead_ThenReadAtIsSetAndUnreadFilterExcludesIt()
    {
        var first = Add(NotificationType.Deposit, 10);
        Add(NotificationType.Statement, 20);

        var marked = await _service.MarkReadAsync(Customer, first.Id, CancellationToken.None);
        var unread = await _service.ListAsync(Customer, Account, true, CancellationToken.None);

        Assert.True(marked);
        Assert.Equal(Now, _repository.Items.Single(n => n.Id == first.Id).ReadAt);
        Assert.Single(unread);
        Assert.Equal("STATEMENT", unread[0].Type);
    }

    [Fact]
    public async Task GivenOtherCustomersNotification_WhenMarkingRead_ThenReturnsFalse()
    {
        var foreign = Add(NotificationType.Deposit, 10, customer: "CUST-9999");

        var marked = await _service.MarkReadAsync(Customer, foreign.Id, CancellationToken.None);

        Assert.False(marked);
        Assert.Null(_repository.Items.Single().ReadAt);
    }

    [Fact]
    public async Task GivenDisabledType_WhenListing_ThenThoseNotificationsAreHidden()
    {
        Add(NotificationType.LowBalance, 10);
        Add(NotificationType.Deposit, 20);
        await _service.SavePreferencesAsync(
            Customer, Account, new[] { new PreferenceDto("LOW_BALANCE", false) }, CancellationToken.None);

        var result = await _service.ListAsync(Customer, Account, false, CancellationToken.None);

        Assert.Single(result);
        Assert.Equal("DEPOSIT", result[0].Type);
    }

    [Fact]
    public async Task GivenNoStoredPreferences_WhenGettingPreferences_ThenAllTypesAreEnabled()
    {
        var result = await _service.GetPreferencesAsync(Customer, Account, CancellationToken.None);

        Assert.Equal(4, result.Count);
        Assert.All(result, p => Assert.True(p.Enabled));
    }

    [Fact]
    public async Task GivenUnknownType_WhenSavingPreferences_ThenThrowsInvalidRequest()
    {
        await Assert.ThrowsAsync<InvalidNotificationRequestException>(() =>
            _service.SavePreferencesAsync(
                Customer, Account, new[] { new PreferenceDto("SMS", true) }, CancellationToken.None));
    }

    [Fact]
    public async Task GivenBlankAccount_WhenListing_ThenThrowsInvalidRequest()
    {
        await Assert.ThrowsAsync<InvalidNotificationRequestException>(() =>
            _service.ListAsync(Customer, " ", false, CancellationToken.None));
    }

    [Theory]
    [InlineData("10020030041234", "****1234")]
    [InlineData("123", "****")]
    [InlineData("", "****")]
    public void GivenAccountId_WhenMasking_ThenOnlyLastFourDigitsRemain(string accountId, string expected)
    {
        Assert.Equal(expected, AccountMask.Mask(accountId));
    }
}

using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;
using Tarjetas.Notificaciones.Infrastructure;
using Xunit;

namespace Tarjetas.Notificaciones.Tests;

public class NotificationServiceTests
{
    private const string Customer = "CLI-T1";

    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }

    private sealed class FakeCustomer(string id) : ICurrentCustomer
    {
        public string CustomerId { get; } = id;
    }

    private sealed class SpyDispatcher : INotificationDispatcher
    {
        public List<(Guid Id, Channel Channel)> Sent { get; } = [];

        public Task DispatchAsync(Notification notification, Channel channel, CancellationToken ct = default)
        {
            Sent.Add((notification.Id, channel));
            return Task.CompletedTask;
        }
    }

    private static readonly DateTimeOffset Now = new(2026, 1, 15, 10, 0, 0, TimeSpan.Zero);

    private static (NotificationService Service, InMemoryNotificationRepository Repo, SpyDispatcher Spy) Build(
        string customer = Customer)
    {
        var repo = new InMemoryNotificationRepository();
        var spy = new SpyDispatcher();
        return (new NotificationService(repo, spy, new FakeCustomer(customer), new FixedClock(Now)), repo, spy);
    }

    private static CardEvent Event(string id = "evt-1", string last4 = "1234", NotificationType type = NotificationType.Compra) =>
        new(id, Customer, "tok-1", last4, type, "Compra aprobada", "Compra ficticia de 10 USD");

    [Fact]
    public async Task GivenNewEvent_WhenRegistered_ThenItAppearsUnreadInList()
    {
        var (service, _, _) = Build();

        var result = await service.RegisterEventAsync(Event());
        var page = await service.ListAsync(unreadOnly: true);

        Assert.Equal(RegisterResult.Created, result);
        var item = Assert.Single(page.Items);
        Assert.Equal("1234", item.CardLast4);
        Assert.False(item.IsRead);
        Assert.Equal(Now, item.CreatedAt);
    }

    [Fact]
    public async Task GivenSameEventId_WhenRegisteredTwice_ThenSecondIsDuplicate()
    {
        var (service, _, _) = Build();

        await service.RegisterEventAsync(Event());
        var second = await service.RegisterEventAsync(Event());
        var page = await service.ListAsync(false);

        Assert.Equal(RegisterResult.Duplicate, second);
        Assert.Equal(1, page.Total);
    }

    [Theory]
    [InlineData("123")]
    [InlineData("12345")]
    [InlineData("12a4")]
    [InlineData("")]
    public async Task GivenInvalidLast4_WhenRegistered_ThenRejected(string last4)
    {
        var (service, _, _) = Build();

        await Assert.ThrowsAsync<InvalidRequestException>(() => service.RegisterEventAsync(Event(last4: last4)));
    }

    [Fact]
    public async Task GivenInAppDisabledForType_WhenRegistered_ThenSuppressedAndNotStored()
    {
        var (service, _, _) = Build();
        await service.UpdatePreferencesAsync([new Preference(NotificationType.Compra, Channel.InApp, false)]);

        var result = await service.RegisterEventAsync(Event());
        var page = await service.ListAsync(false);

        Assert.Equal(RegisterResult.Suppressed, result);
        Assert.Empty(page.Items);
    }

    [Fact]
    public async Task GivenEmailEnabled_WhenRegistered_ThenDispatchedOnlyToEmail()
    {
        var (service, _, spy) = Build();
        await service.UpdatePreferencesAsync([new Preference(NotificationType.Compra, Channel.Email, true)]);

        await service.RegisterEventAsync(Event());

        var sent = Assert.Single(spy.Sent);
        Assert.Equal(Channel.Email, sent.Channel);
    }

    [Fact]
    public async Task GivenDefaultPreferences_WhenRegistered_ThenNothingIsDispatchedExternally()
    {
        var (service, _, spy) = Build();

        await service.RegisterEventAsync(Event());

        Assert.Empty(spy.Sent);
    }

    [Fact]
    public async Task GivenUnreadNotification_WhenMarkedRead_ThenExcludedFromUnreadList()
    {
        var (service, _, _) = Build();
        await service.RegisterEventAsync(Event());
        var id = (await service.ListAsync(true)).Items[0].Id;

        await service.MarkReadAsync(id);

        Assert.Empty((await service.ListAsync(true)).Items);
        var all = await service.ListAsync(false);
        Assert.True(all.Items[0].IsRead);
    }

    [Fact]
    public async Task GivenUnknownId_WhenMarkedRead_ThenNotFound()
    {
        var (service, _, _) = Build();

        await Assert.ThrowsAsync<ResourceNotFoundException>(() => service.MarkReadAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task GivenNotificationOfAnotherCustomer_WhenMarkedRead_ThenNotFound()
    {
        var (owner, repo, _) = Build();
        await owner.RegisterEventAsync(Event());
        var id = (await owner.ListAsync(false)).Items[0].Id;
        var intruder = new NotificationService(
            repo, new SpyDispatcher(), new FakeCustomer("CLI-OTHER"), new FixedClock(Now));

        await Assert.ThrowsAsync<ResourceNotFoundException>(() => intruder.MarkReadAsync(id));
        Assert.Empty((await intruder.ListAsync(false)).Items);
    }

    [Theory]
    [InlineData(0, 20)]
    [InlineData(1, 0)]
    [InlineData(1, 51)]
    public async Task GivenInvalidPaging_WhenListed_ThenRejected(int page, int pageSize)
    {
        var (service, _, _) = Build();

        await Assert.ThrowsAsync<InvalidRequestException>(() => service.ListAsync(false, page, pageSize));
    }

    [Fact]
    public async Task GivenManyNotifications_WhenPaged_ThenNewestFirstAndTotalIsReported()
    {
        var (service, _, _) = Build();
        for (var i = 0; i < 3; i++) await service.RegisterEventAsync(Event($"evt-{i}"));

        var page = await service.ListAsync(false, page: 2, pageSize: 2);

        Assert.Equal(3, page.Total);
        Assert.Single(page.Items);
    }

    [Fact]
    public async Task GivenNoStoredPreferences_WhenRead_ThenFullMatrixWithOnlyInAppEnabled()
    {
        var (service, _, _) = Build();

        var prefs = await service.GetPreferencesAsync();

        Assert.Equal(Enum.GetValues<NotificationType>().Length * Enum.GetValues<Channel>().Length, prefs.Count);
        Assert.All(prefs, p => Assert.Equal(p.Channel == Channel.InApp, p.Enabled));
    }

    [Fact]
    public async Task GivenDuplicatedPreferences_WhenUpdated_ThenRejected()
    {
        var (service, _, _) = Build();
        var duplicated = new[]
        {
            new Preference(NotificationType.Bloqueo, Channel.Sms, true),
            new Preference(NotificationType.Bloqueo, Channel.Sms, false)
        };

        await Assert.ThrowsAsync<InvalidRequestException>(() => service.UpdatePreferencesAsync(duplicated));
    }

    [Fact]
    public async Task GivenUpdatedPreference_WhenRead_ThenChangeIsReflected()
    {
        var (service, _, _) = Build();

        var updated = await service.UpdatePreferencesAsync([new Preference(NotificationType.Bloqueo, Channel.Sms, true)]);

        Assert.Contains(updated, p => p.Type == NotificationType.Bloqueo && p.Channel == Channel.Sms && p.Enabled);
    }
}

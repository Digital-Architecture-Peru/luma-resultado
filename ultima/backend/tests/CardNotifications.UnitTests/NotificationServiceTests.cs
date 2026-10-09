using CardNotifications.Application;
using CardNotifications.Domain;

namespace CardNotifications.UnitTests;

public class NotificationServiceTests
{
    private const string Customer = "CUST-DEMO-001";
    private static readonly DateTimeOffset Now = new(2026, 10, 9, 12, 0, 0, TimeSpan.Zero);

    private static CardEvent Event(NotificationType type = NotificationType.PurchaseApproved, string last4 = "1234") =>
        new(Customer, "card_demo_01", last4, type, "S/ 10.00");

    private static (NotificationService Service, InMemoryNotificationRepository Repo, RecordingDispatcher Dispatcher) Build(
        params CardEvent[] events)
    {
        var repo = new InMemoryNotificationRepository();
        var dispatcher = new RecordingDispatcher();
        var service = new NotificationService(repo, new StubCardEventSource(events), dispatcher, new FixedTimeProvider(Now));
        return (Service: service, Repo: repo, Dispatcher: dispatcher);
    }

    [Fact]
    public async Task Ingest_WithDefaultPreferences_StoresInAppNotification()
    {
        var (service, repo, dispatcher) = Build(Event());

        var created = await service.IngestAsync(CancellationToken.None);

        Assert.Equal(1, created);
        var stored = Assert.Single(repo.All);
        Assert.Equal("Compra aprobada", stored.Title);
        Assert.Contains("1234", stored.Body);
        Assert.Equal(Now, stored.CreatedAt);
        Assert.False(stored.IsRead);
        Assert.Empty(dispatcher.Sent);
    }

    [Fact]
    public async Task Ingest_WhenInAppDisabledForNonProtectedType_StoresNothing()
    {
        var (service, repo, _) = Build(Event(NotificationType.LimitChanged));
        await service.SavePreferencesAsync(Customer,
            new[] { new Preference(NotificationType.LimitChanged, Channel.InApp, false) }, CancellationToken.None);

        var created = await service.IngestAsync(CancellationToken.None);

        Assert.Equal(0, created);
        Assert.Empty(repo.All);
    }

    [Fact]
    public async Task Ingest_WhenEmailEnabled_DispatchesToEmailChannel()
    {
        var (service, _, dispatcher) = Build(Event());
        await service.SavePreferencesAsync(Customer,
            new[] { new Preference(NotificationType.PurchaseApproved, Channel.Email, true) }, CancellationToken.None);

        await service.IngestAsync(CancellationToken.None);

        var sent = Assert.Single(dispatcher.Sent);
        Assert.Equal(Channel.Email, sent.Channel);
        Assert.Equal(NotificationType.PurchaseApproved, sent.Notification.Type);
    }

    [Fact]
    public async Task Ingest_EventWithInvalidLast4_IsSkippedWithoutStoppingBatch()
    {
        var (service, repo, _) = Build(Event(last4: "12AB"), Event(NotificationType.CardBlocked));

        var created = await service.IngestAsync(CancellationToken.None);

        Assert.Equal(1, created);
        Assert.Equal(Severity.Critical, Assert.Single(repo.All).Severity);
    }

    [Fact]
    public async Task MarkRead_UnknownId_ThrowsNotFound()
    {
        var (service, _, _) = Build();

        await Assert.ThrowsAsync<NotFoundException>(
            () => service.MarkReadAsync(Customer, Guid.NewGuid(), CancellationToken.None));
    }

    [Fact]
    public async Task MarkRead_ExistingNotification_SetsReadAtAndReducesUnread()
    {
        var (service, repo, _) = Build(Event(), Event(NotificationType.LimitChanged));
        await service.IngestAsync(CancellationToken.None);
        var id = repo.All[0].Id;

        await service.MarkReadAsync(Customer, id, CancellationToken.None);
        var page = await service.ListAsync(Customer, false, 1, 20, CancellationToken.None);

        Assert.Equal(1, page.Unread);
        Assert.Equal(Now, repo.All.Single(n => n.Id == id).ReadAt);
    }

    [Fact]
    public async Task MarkRead_OtherCustomersNotification_ThrowsNotFound()
    {
        var (service, repo, _) = Build(Event());
        await service.IngestAsync(CancellationToken.None);

        await Assert.ThrowsAsync<NotFoundException>(
            () => service.MarkReadAsync("CUST-OTHER", repo.All[0].Id, CancellationToken.None));
    }

    [Fact]
    public async Task MarkAllRead_ReturnsUpdatedCountAndClearsUnread()
    {
        var (service, _, _) = Build(Event(), Event(NotificationType.CardUnblocked));
        await service.IngestAsync(CancellationToken.None);

        var updated = await service.MarkAllReadAsync(Customer, CancellationToken.None);
        var page = await service.ListAsync(Customer, true, 1, 20, CancellationToken.None);

        Assert.Equal(2, updated);
        Assert.Empty(page.Items);
        Assert.Equal(0, page.Unread);
    }

    [Theory]
    [InlineData(0, 20)]
    [InlineData(1, 0)]
    [InlineData(1, 51)]
    public async Task List_InvalidPaging_ThrowsValidation(int page, int size)
    {
        var (service, _, _) = Build();

        await Assert.ThrowsAsync<DomainValidationException>(
            () => service.ListAsync(Customer, false, page, size, CancellationToken.None));
    }

    [Fact]
    public async Task SavePreferences_DisablingProtectedChannel_ThrowsValidation()
    {
        var (service, _, _) = Build();

        var error = await Assert.ThrowsAsync<DomainValidationException>(() => service.SavePreferencesAsync(
            Customer, new[] { new Preference(NotificationType.CardBlocked, Channel.InApp, false) }, CancellationToken.None));

        Assert.Contains("CardBlocked", error.Message);
    }

    [Fact]
    public async Task GetPreferences_WithoutStoredValues_ReturnsFullMatrixWithDefaults()
    {
        var (service, _, _) = Build();

        var preferences = await service.GetPreferencesAsync(Customer, CancellationToken.None);

        Assert.Equal(24, preferences.Count);
        Assert.All(preferences, p => Assert.Equal(p.Channel == Channel.InApp, p.Enabled));
    }
}

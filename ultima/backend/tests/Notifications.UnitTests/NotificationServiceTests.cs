using Notifications.Application;
using Notifications.Domain;
using Xunit;

namespace Notifications.UnitTests;

public class NotificationServiceTests
{
    private const string Customer = "CUST-0001";
    private readonly InMemoryRepository _repo = new();
    private readonly FakeClock _clock = new();
    private readonly NotificationService _service;

    public NotificationServiceTests()
    {
        _service = new NotificationService(_repo, new INotificationChannel[] { new RepositoryChannel(_repo) }, _clock);
    }

    private static PaymentEvent Event(string id = "EVT-1", string type = "PAYMENT_COMPLETED",
        decimal amount = 100.5m, string currency = "USD", string account = "0012345678") =>
        new(id, type, amount, currency, account);

    [Fact]
    public async Task Ingest_ValidEvent_CreatesUnreadNotificationWithMaskedAccount()
    {
        var result = await _service.IngestAsync(Customer, Event(), CancellationToken.None);

        Assert.True(result.Created);
        Assert.Equal("UNREAD", result.Notification.Status);
        Assert.Equal("****5678", result.Notification.MaskedAccount);
        Assert.DoesNotContain("0012345678", result.Notification.Message);
        Assert.Single(_repo.Items);
    }

    [Fact]
    public async Task Ingest_SameEventTwice_DoesNotDuplicate()
    {
        await _service.IngestAsync(Customer, Event(), CancellationToken.None);
        var second = await _service.IngestAsync(Customer, Event(), CancellationToken.None);

        Assert.False(second.Created);
        Assert.Single(_repo.Items);
    }

    [Theory]
    [InlineData("UNKNOWN", 10, "USD")]
    [InlineData("PAYMENT_COMPLETED", 0, "USD")]
    [InlineData("PAYMENT_COMPLETED", -5, "USD")]
    [InlineData("PAYMENT_COMPLETED", 10, "usd")]
    [InlineData("PAYMENT_COMPLETED", 10, "US")]
    public async Task Ingest_InvalidInput_ThrowsValidation(string type, decimal amount, string currency)
    {
        await Assert.ThrowsAsync<DomainValidationException>(() =>
            _service.IngestAsync(Customer, Event(type: type, amount: amount, currency: currency), CancellationToken.None));
    }

    [Fact]
    public async Task Ingest_ShortAccount_ThrowsValidation()
    {
        await Assert.ThrowsAsync<DomainValidationException>(() =>
            _service.IngestAsync(Customer, Event(account: "12"), CancellationToken.None));
    }

    [Theory]
    [InlineData("PAYMENT_COMPLETED", "Pago realizado")]
    [InlineData("PAYMENT_REJECTED", "Pago rechazado")]
    [InlineData("PAYMENT_SCHEDULED", "Pago programado")]
    public async Task Ingest_EachType_UsesMatchingTitle(string type, string expectedTitle)
    {
        var result = await _service.IngestAsync(Customer, Event(type: type), CancellationToken.None);
        Assert.Equal(expectedTitle, result.Notification.Title);
    }

    [Fact]
    public async Task List_FiltersByStatusAndCustomer()
    {
        await _service.IngestAsync(Customer, Event("A"), CancellationToken.None);
        var b = await _service.IngestAsync(Customer, Event("B"), CancellationToken.None);
        await _service.IngestAsync("CUST-OTHER", Event("C"), CancellationToken.None);
        await _service.MarkReadAsync(Customer, b.Notification.Id, CancellationToken.None);

        var unread = await _service.ListAsync(Customer, "UNREAD", 1, 20, CancellationToken.None);
        var all = await _service.ListAsync(Customer, null, 1, 20, CancellationToken.None);

        Assert.Single(unread);
        Assert.Equal(2, all.Count);
    }

    [Theory]
    [InlineData(0, 20, null)]
    [InlineData(1, 0, null)]
    [InlineData(1, 101, null)]
    [InlineData(1, 20, "OTHER")]
    public async Task List_InvalidParameters_ThrowsValidation(int page, int size, string? status)
    {
        await Assert.ThrowsAsync<DomainValidationException>(() =>
            _service.ListAsync(Customer, status, page, size, CancellationToken.None));
    }

    [Fact]
    public async Task MarkRead_SetsReadAtAndDecrementsUnreadCount()
    {
        var created = await _service.IngestAsync(Customer, Event(), CancellationToken.None);
        Assert.Equal(1, await _service.UnreadCountAsync(Customer, CancellationToken.None));

        var updated = await _service.MarkReadAsync(Customer, created.Notification.Id, CancellationToken.None);

        Assert.NotNull(updated);
        Assert.Equal("READ", updated!.Status);
        Assert.Equal(_clock.Now, updated.ReadAt);
        Assert.Equal(0, await _service.UnreadCountAsync(Customer, CancellationToken.None));
    }

    [Fact]
    public async Task MarkRead_NotificationOfAnotherCustomer_ReturnsNull()
    {
        var created = await _service.IngestAsync("CUST-OTHER", Event(), CancellationToken.None);

        var result = await _service.MarkReadAsync(Customer, created.Notification.Id, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task MissingCustomer_ThrowsValidation()
    {
        await Assert.ThrowsAsync<DomainValidationException>(() =>
            _service.UnreadCountAsync(" ", CancellationToken.None));
    }
}

public class AccountMaskerTests
{
    [Theory]
    [InlineData("0012345678", "****5678")]
    [InlineData("1234", "****1234")]
    [InlineData("12-34-56", "****3456")]
    public void Mask_KeepsOnlyLastFourDigits(string input, string expected) =>
        Assert.Equal(expected, AccountMasker.Mask(input));

    [Fact]
    public void Mask_NullAccount_Throws() =>
        Assert.Throws<DomainValidationException>(() => AccountMasker.Mask(null));
}

using Payments.Notifications.Domain;
using Xunit;

namespace Payments.Notifications.UnitTests;

public class PaymentNotificationTests
{
    private static readonly DateTimeOffset T0 = new(2026, 1, 1, 10, 0, 0, TimeSpan.Zero);

    private static PaymentNotification Create(string paymentRef = "****1234", string currency = "PEN", decimal amount = 10m) =>
        new(Guid.NewGuid(), "CUST-001", paymentRef, NotificationType.PaymentDone, "Pago", "Detalle", amount, currency, T0);

    [Fact]
    public void GivenMaskedRef_WhenCreated_ThenIsUnread()
    {
        var n = Create();
        Assert.False(n.IsRead);
        Assert.Null(n.ReadAt);
    }

    [Theory]
    [InlineData("1234567812345678")]
    [InlineData("1234")]
    [InlineData("")]
    public void GivenUnmaskedRef_WhenCreated_ThenThrows(string paymentRef)
    {
        Assert.Throws<ArgumentException>(() => Create(paymentRef: paymentRef));
    }

    [Fact]
    public void GivenInvalidCurrency_WhenCreated_ThenThrows()
    {
        Assert.Throws<ArgumentException>(() => Create(currency: "pe"));
    }

    [Fact]
    public void GivenNegativeAmount_WhenCreated_ThenThrows()
    {
        Assert.Throws<ArgumentException>(() => Create(amount: -1m));
    }

    [Fact]
    public void GivenUnread_WhenMarkedTwice_ThenKeepsFirstReadDate()
    {
        var n = Create();

        Assert.True(n.MarkAsRead(T0.AddHours(1)));
        Assert.False(n.MarkAsRead(T0.AddHours(2)));

        Assert.Equal(T0.AddHours(1), n.ReadAt);
    }

    [Theory]
    [InlineData(NotificationType.PaymentDone, "PAYMENT_DONE")]
    [InlineData(NotificationType.PaymentRejected, "PAYMENT_REJECTED")]
    [InlineData(NotificationType.PaymentDue, "PAYMENT_DUE")]
    public void GivenType_WhenConverted_ThenRoundTripsThroughCode(NotificationType type, string code)
    {
        Assert.Equal(code, type.ToCode());
        Assert.Equal(type, NotificationTypeCodes.Parse(code));
    }
}

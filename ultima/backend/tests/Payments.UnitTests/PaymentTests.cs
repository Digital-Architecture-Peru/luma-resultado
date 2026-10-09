using Payments.Domain;
using Xunit;

namespace Payments.UnitTests;

public class PaymentTests
{
    private static readonly DateTimeOffset Now = new(2026, 1, 15, 10, 0, 0, TimeSpan.Zero);

    private static Payment NewPayment(decimal amount = 100m, string currency = "PEN") =>
        Payment.Create("C-1001", "00100000000001", "00200000000002", amount, currency, "Servicio", "key-1", Now);

    [Theory]
    [InlineData(0)]
    [InlineData(-5.50)]
    public void GivenNonPositiveAmount_WhenCreate_ThenRejected(double amount)
    {
        Assert.Throws<DomainException>(() => NewPayment((decimal)amount));
    }

    [Fact]
    public void GivenMoreThanTwoDecimals_WhenCreate_ThenRejected()
    {
        Assert.Throws<DomainException>(() => NewPayment(10.123m));
    }

    [Fact]
    public void GivenInvalidCurrency_WhenCreate_ThenRejected()
    {
        Assert.Throws<DomainException>(() => NewPayment(10m, "SOLES"));
    }

    [Fact]
    public void GivenValidData_WhenCreate_ThenPendingWithUppercaseCurrency()
    {
        var payment = NewPayment(25.50m, "pen");

        Assert.Equal(PaymentStatus.Pending, payment.Status);
        Assert.Equal("PEN", payment.Currency);
        Assert.Null(payment.ProcessedAt);
    }

    [Fact]
    public void GivenPending_WhenComplete_ThenCompletedWithProcessedAt()
    {
        var payment = NewPayment();

        payment.Complete(Now.AddSeconds(1));

        Assert.Equal(PaymentStatus.Completed, payment.Status);
        Assert.Equal(Now.AddSeconds(1), payment.ProcessedAt);
    }

    [Fact]
    public void GivenCompleted_WhenReject_ThenInvalidTransition()
    {
        var payment = NewPayment();
        payment.Complete(Now);

        Assert.Throws<InvalidStatusTransitionException>(() => payment.Reject("tarde", Now));
    }

    [Fact]
    public void GivenRejected_WhenComplete_ThenInvalidTransition()
    {
        var payment = NewPayment();
        payment.Reject("sin fondos", Now);

        Assert.Equal("sin fondos", payment.FailureReason);
        Assert.Throws<InvalidStatusTransitionException>(() => payment.Complete(Now));
    }
}

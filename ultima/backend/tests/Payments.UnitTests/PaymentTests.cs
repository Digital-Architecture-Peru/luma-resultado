using Payments.Domain;

namespace Payments.UnitTests;

public class PaymentTests
{
    private static readonly Account Source =
        new(Guid.Parse("11111111-1111-4111-8111-111111111111"), "ACC00000001", "Ana Ficticia", "USD", 1000m);

    private static readonly DateTimeOffset Now = new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

    private static PaymentRequest Request(
        decimal amount = 100m, string beneficiary = "ACC00000009", string currency = "USD", string reference = "Alquiler") =>
        new(Source.Id, beneficiary, amount, currency, reference);

    private static Payment Create(PaymentRequest request, decimal max = 5000m) =>
        Payment.Create(Source, request, "key-1", max, Now);

    [Fact]
    public void GivenValidRequest_WhenCreate_ThenPendingPaymentWithNormalizedData()
    {
        var payment = Create(Request(currency: "usd", beneficiary: " ACC00000009 "));

        Assert.Equal(PaymentStatus.Pending, payment.Status);
        Assert.Equal("USD", payment.Currency);
        Assert.Equal("ACC00000009", payment.BeneficiaryAccount);
        Assert.Equal(100m, payment.Amount);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void GivenNonPositiveAmount_WhenCreate_ThenThrows(double amount)
    {
        Assert.Throws<DomainException>(() => Create(Request(amount: (decimal)amount)));
    }

    [Fact]
    public void GivenMoreThanTwoDecimals_WhenCreate_ThenThrows()
    {
        Assert.Throws<DomainException>(() => Create(Request(amount: 10.123m)));
    }

    [Fact]
    public void GivenAmountOverLimit_WhenCreate_ThenThrows()
    {
        Assert.Throws<DomainException>(() => Create(Request(amount: 600m), max: 500m));
    }

    [Fact]
    public void GivenSameSourceAndBeneficiary_WhenCreate_ThenThrows()
    {
        Assert.Throws<DomainException>(() => Create(Request(beneficiary: "ACC00000001")));
    }

    [Fact]
    public void GivenInvalidBeneficiaryFormat_WhenCreate_ThenThrows()
    {
        Assert.Throws<DomainException>(() => Create(Request(beneficiary: "12 34")));
    }

    [Fact]
    public void GivenCurrencyMismatch_WhenCreate_ThenThrows()
    {
        Assert.Throws<DomainException>(() => Create(Request(currency: "EUR")));
    }

    [Fact]
    public void GivenInsufficientBalance_WhenCreate_ThenThrows()
    {
        var ex = Assert.Throws<DomainException>(() => Create(Request(amount: 1000.01m)));
        Assert.Contains("Saldo", ex.Message);
    }

    [Fact]
    public void GivenCompletedPayment_WhenReject_ThenThrows()
    {
        var payment = Create(Request());
        payment.Complete();

        Assert.Throws<DomainException>(() => payment.Reject());
    }

    [Fact]
    public void GivenSamePayloadWithDifferentWhitespace_WhenMatches_ThenTrue()
    {
        var payment = Create(Request());

        Assert.True(payment.Matches(Request(reference: " Alquiler ")));
        Assert.False(payment.Matches(Request(amount: 101m)));
    }
}

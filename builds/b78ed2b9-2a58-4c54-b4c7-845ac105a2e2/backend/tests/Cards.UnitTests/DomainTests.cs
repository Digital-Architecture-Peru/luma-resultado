using Cards.Application;
using Cards.Domain;
using Cards.Infrastructure;
using Xunit;

namespace Cards.UnitTests;

public class DomainTests
{
    private static readonly Card Sample = new(Guid.NewGuid(), "**** 1234", "Demo", 1000m, 400m, "USD");

    [Theory]
    [InlineData(0, false)]
    [InlineData(-1, false)]
    [InlineData(1, true)]
    [InlineData(600, true)]
    [InlineData(600.01, false)]
    public void GivenCard_WhenCheckingPayment_ThenRespectsOutstandingBalance(double amount, bool expected)
    {
        Assert.Equal(expected, Sample.CanAcceptPayment((decimal)amount));
    }

    [Fact]
    public void GivenCard_WhenMapped_ThenDtoExposesOutstandingBalance()
    {
        var dto = Sample.ToDto();

        Assert.Equal(600m, dto.OutstandingBalance);
        Assert.Equal("**** 1234", dto.MaskedPan);
    }

    [Fact]
    public async Task GivenFakeGateway_WhenAmountAboveCap_ThenDeclines()
    {
        var gateway = new FakeCardProcessorGateway();

        var ok = await gateway.AuthorizePaymentAsync(Sample.Id, 10m, "USD", CancellationToken.None);
        var declined = await gateway.AuthorizePaymentAsync(
            Sample.Id, FakeCardProcessorGateway.MaxApprovedAmount + 1, "USD", CancellationToken.None);

        Assert.True(ok.Approved);
        Assert.False(declined.Approved);
    }
}

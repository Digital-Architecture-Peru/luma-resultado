using CardsQuery.Api.Atoms;
using Xunit;

namespace CardsQuery.Tests;

public class AtomsTests
{
    [Fact]
    public void Mask_GivenFullNumber_ShowsOnlyLastFourDigits()
    {
        Assert.Equal("**** **** **** 1111", CardNumberMask.Mask("4000 1234 1234 1111"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("12")]
    [InlineData("abc")]
    public void Mask_GivenTooFewDigits_Throws(string number)
    {
        Assert.Throws<ArgumentException>(() => CardNumberMask.Mask(number));
    }

    [Fact]
    public void Money_GivenValidInput_RoundsAndUppercasesCurrency()
    {
        var money = Money.Of(10.456m, "usd");
        Assert.Equal(10.46m, money.Amount);
        Assert.Equal("USD", money.Currency);
    }

    [Fact]
    public void Money_GivenInvalidCurrency_Throws()
    {
        Assert.Throws<ArgumentException>(() => Money.Of(1m, "US"));
    }
}

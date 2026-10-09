using Cards.Application;
using Xunit;

namespace Cards.Tests;

public class CardMaskingTests
{
    [Fact]
    public void Mask_GivenFourDigits_ReturnsMaskedNumber()
    {
        Assert.Equal("**** **** **** 1234", CardMasking.Mask("1234"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("12345")]
    [InlineData("12a4")]
    public void Mask_GivenInvalidInput_Throws(string input)
    {
        Assert.Throws<ArgumentException>(() => CardMasking.Mask(input));
    }

    [Fact]
    public void FormatExpiry_PadsMonthAndUsesTwoDigitYear()
    {
        Assert.Equal("03/29", CardMasking.FormatExpiry(3, 2029));
    }

    [Fact]
    public void FormatExpiry_GivenInvalidMonth_Throws()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => CardMasking.FormatExpiry(13, 2029));
    }
}

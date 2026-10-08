using Cards.Application;
using Xunit;

namespace Cards.UnitTests;

public class MaskingTests
{
    [Fact]
    public void GivenLast4_WhenMasking_ThenOnlyLastFourAreVisible()
    {
        Assert.Equal("**** 1234", PanMasking.Mask("1234"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("12345")]
    [InlineData("12a4")]
    public void GivenInvalidLast4_WhenMasking_ThenThrows(string value)
    {
        Assert.Throws<ArgumentException>(() => PanMasking.Mask(value));
    }
}

using Cards.Domain;
using Xunit;

namespace Cards.UnitTests;

public class PanMaskerTests
{
    [Fact]
    public void Given_valid_last4_when_masking_then_only_last4_is_visible()
    {
        Assert.Equal("**** **** **** 4821", PanMasker.FromLast4("4821"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("12345")]
    [InlineData("12a4")]
    public void Given_invalid_last4_when_masking_then_throws(string last4)
    {
        Assert.Throws<ArgumentException>(() => PanMasker.FromLast4(last4));
    }
}

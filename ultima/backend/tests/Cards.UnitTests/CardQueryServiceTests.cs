using Cards.Application;
using Cards.Infrastructure;
using Xunit;

namespace Cards.UnitTests;

public class CardQueryServiceTests
{
    private static CardQueryService CreateService() => new(new InMemoryCardRepository());

    [Fact]
    public async Task Given_customer_with_cards_when_listing_then_returns_masked_summaries()
    {
        var cards = await CreateService().GetCustomerCardsAsync("demo-001");

        Assert.Equal(2, cards.Count);
        Assert.All(cards, c => Assert.StartsWith("**** **** **** ", c.MaskedPan));
        Assert.Contains(cards, c => c.Status == "ACTIVE");
        Assert.Contains(cards, c => c.Status == "BLOCKED");
    }

    [Fact]
    public async Task Given_unknown_customer_when_listing_then_returns_empty()
    {
        var cards = await CreateService().GetCustomerCardsAsync("demo-999");

        Assert.Empty(cards);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("demo 001")]
    [InlineData("demo'; DROP TABLE cards;--")]
    public async Task Given_invalid_customer_id_when_listing_then_throws(string customerId)
    {
        await Assert.ThrowsAsync<ArgumentException>(() => CreateService().GetCustomerCardsAsync(customerId));
    }

    [Fact]
    public async Task Given_too_long_customer_id_when_listing_then_throws()
    {
        var customerId = new string('a', 37);

        await Assert.ThrowsAsync<ArgumentException>(() => CreateService().GetCustomerCardsAsync(customerId));
    }

    [Fact]
    public async Task Given_existing_card_when_getting_detail_then_includes_limit_and_expiry()
    {
        var id = Guid.Parse("11111111-1111-1111-1111-111111111101");

        var detail = await CreateService().GetCardDetailAsync(id);

        Assert.NotNull(detail);
        Assert.Equal(15000.00m, detail!.CreditLimit);
        Assert.Equal("12/28", detail.Expiry);
        Assert.Equal("USD", detail.Currency);
    }

    [Fact]
    public async Task Given_missing_card_when_getting_detail_then_returns_null()
    {
        var detail = await CreateService().GetCardDetailAsync(Guid.NewGuid());

        Assert.Null(detail);
    }
}

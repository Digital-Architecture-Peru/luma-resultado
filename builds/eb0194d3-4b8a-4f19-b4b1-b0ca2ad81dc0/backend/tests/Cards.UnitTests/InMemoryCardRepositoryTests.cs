using Cards.Infrastructure;
using Xunit;

namespace Cards.UnitTests;

public class InMemoryCardRepositoryTests
{
    [Fact]
    public async Task Given_seed_when_listing_by_customer_then_filters_by_exact_customer()
    {
        var repository = new InMemoryCardRepository();

        var cards = await repository.ListByCustomerAsync("demo-002", CancellationToken.None);

        var card = Assert.Single(cards);
        Assert.Equal("1156", card.Last4);
    }

    [Fact]
    public void Given_seed_when_inspecting_then_masked_pan_never_exposes_more_than_last4()
    {
        Assert.All(DemoCards.All, c =>
        {
            Assert.EndsWith(c.Last4, c.MaskedPan);
            Assert.Equal(4, c.MaskedPan.Count(char.IsDigit));
        });
    }
}

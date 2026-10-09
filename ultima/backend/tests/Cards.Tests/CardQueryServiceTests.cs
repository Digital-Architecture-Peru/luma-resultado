using Cards.Application;
using Xunit;

namespace Cards.Tests;

public class CardQueryServiceTests
{
    private static readonly Guid OwnerId = Guid.Parse("11111111-1111-4111-8111-111111111111");
    private static readonly Guid OtherId = Guid.Parse("22222222-2222-4222-8222-222222222222");

    private static Card NewCard(Guid customerId, string last4 = "4242") => new(
        Guid.NewGuid(), customerId, last4, "VISA", "CREDIT", "ACTIVE",
        1000000m, 750000.50m, "CLP", 7, 2028);

    [Fact]
    public async Task GetCards_WhenCustomerHasNoCards_ReturnsEmptyList()
    {
        var service = new CardQueryService(new FakeCardRepository());

        var result = await service.GetCardsAsync(OwnerId);

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetCards_ReturnsOnlyOwnCardsWithMaskedNumber()
    {
        var repo = new FakeCardRepository(NewCard(OwnerId, "4242"), NewCard(OtherId, "9999"));
        var service = new CardQueryService(repo);

        var result = await service.GetCardsAsync(OwnerId);

        var dto = Assert.Single(result);
        Assert.Equal("**** **** **** 4242", dto.MaskedNumber);
        Assert.Equal("07/28", dto.Expiry);
    }

    [Fact]
    public async Task GetCard_WhenCardDoesNotExist_ThrowsNotFound()
    {
        var service = new CardQueryService(new FakeCardRepository());

        await Assert.ThrowsAsync<CardNotFoundException>(() => service.GetCardAsync(OwnerId, Guid.NewGuid()));
    }

    [Fact]
    public async Task GetCard_WhenCardBelongsToAnotherCustomer_ThrowsNotFound()
    {
        var foreign = NewCard(OtherId);
        var service = new CardQueryService(new FakeCardRepository(foreign));

        await Assert.ThrowsAsync<CardNotFoundException>(() => service.GetCardAsync(OwnerId, foreign.Id));
    }

    [Fact]
    public async Task GetCard_WhenCardIsOwned_ReturnsDto()
    {
        var own = NewCard(OwnerId);
        var service = new CardQueryService(new FakeCardRepository(own));

        var dto = await service.GetCardAsync(OwnerId, own.Id);

        Assert.Equal(own.Id, dto.Id);
        Assert.Equal(750000.50m, dto.AvailableBalance);
    }

    private sealed class FakeCardRepository : ICardRepository
    {
        private readonly List<Card> _cards;

        public FakeCardRepository(params Card[] cards)
        {
            _cards = cards.ToList();
        }

        public Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct) =>
            Task.FromResult<IReadOnlyList<Card>>(_cards.Where(c => c.CustomerId == customerId).ToList());

        public Task<Card?> FindByIdAsync(Guid cardId, CancellationToken ct) =>
            Task.FromResult(_cards.FirstOrDefault(c => c.Id == cardId));
    }
}

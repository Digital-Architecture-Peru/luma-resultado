using Cards.Application;
using Cards.Domain;
using Xunit;

namespace Cards.UnitTests;

internal sealed class FakeCardRepository : ICardQueryRepository
{
    private readonly List<Card> _cards;
    private readonly List<CardMovement> _movements;

    public int LastOffset { get; private set; }
    public int LastLimit { get; private set; }

    public FakeCardRepository(List<Card> cards, List<CardMovement> movements)
    {
        _cards = cards;
        _movements = movements;
    }

    public Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<Card>>(_cards.Where(c => c.CustomerId == customerId).ToList());

    public Task<Card?> FindAsync(Guid customerId, Guid cardId, CancellationToken ct) =>
        Task.FromResult(_cards.FirstOrDefault(c => c.Id == cardId && c.CustomerId == customerId));

    public Task<(IReadOnlyList<CardMovement> Items, int Total)> ListMovementsAsync(
        Guid cardId, int offset, int limit, CancellationToken ct)
    {
        LastOffset = offset;
        LastLimit = limit;
        var all = _movements.Where(m => m.CardId == cardId).OrderByDescending(m => m.PostedAt).ToList();
        IReadOnlyList<CardMovement> page = all.Skip(offset).Take(limit).ToList();
        return Task.FromResult((page, all.Count));
    }
}

public class CardQueryServiceTests
{
    private static readonly Guid CustomerA = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid CustomerB = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid CardA = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000001");

    private static (CardQueryService Service, FakeCardRepository Repo) Build()
    {
        var cards = new List<Card>
        {
            new(CardA, CustomerA, "4242", "VISA", "Clásica", CardStatus.Active, 5000m, 3200.50m, "USD", 7, 2028),
            new(Guid.NewGuid(), CustomerB, "1111", "MASTERCARD", "Oro", CardStatus.Blocked, 9000m, 100m, "USD", 1, 2027)
        };
        var movements = Enumerable.Range(1, 5)
            .Select(i => new CardMovement(
                Guid.NewGuid(), CardA, new DateTimeOffset(2026, 1, i, 10, 0, 0, TimeSpan.Zero),
                $"Compra {i}", 10m * i, "USD"))
            .ToList();
        var repo = new FakeCardRepository(cards, movements);
        return (new CardQueryService(repo), repo);
    }

    [Fact]
    public async Task GivenCustomer_WhenListing_ThenReturnsOnlyOwnCardsWithMaskedPan()
    {
        var (service, _) = Build();

        var result = await service.ListAsync(CustomerA, CancellationToken.None);

        var card = Assert.Single(result);
        Assert.Equal("**** 4242", card.MaskedPan);
        Assert.Equal("Active", card.Status);
        Assert.Equal("07/28", card.Expiry);
    }

    [Fact]
    public async Task GivenCardOfAnotherCustomer_WhenGetting_ThenReturnsNull()
    {
        var (service, _) = Build();

        var result = await service.GetAsync(CustomerB, CardA, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task GivenPageTwo_WhenListingMovements_ThenComputesOffsetAndTotal()
    {
        var (service, repo) = Build();

        var result = await service.GetMovementsAsync(CustomerA, CardA, 2, 2, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(2, repo.LastOffset);
        Assert.Equal(2, repo.LastLimit);
        Assert.Equal(5, result!.Total);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal("Compra 3", result.Items[0].Description);
    }

    [Fact]
    public async Task GivenOtherCustomer_WhenListingMovements_ThenReturnsNull()
    {
        var (service, _) = Build();

        var result = await service.GetMovementsAsync(CustomerB, CardA, 1, 10, CancellationToken.None);

        Assert.Null(result);
    }

    [Theory]
    [InlineData(0, 10)]
    [InlineData(1, 0)]
    [InlineData(1, 101)]
    public async Task GivenInvalidPaging_WhenListingMovements_ThenThrows(int page, int size)
    {
        var (service, _) = Build();

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
            service.GetMovementsAsync(CustomerA, CardA, page, size, CancellationToken.None));
    }
}

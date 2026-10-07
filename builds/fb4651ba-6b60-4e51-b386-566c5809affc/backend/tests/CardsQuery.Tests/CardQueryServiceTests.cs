using CardsQuery.Api.Adapters;
using CardsQuery.Api.Domain;
using CardsQuery.Api.Organisms;
using Xunit;

namespace CardsQuery.Tests;

public class CardQueryServiceTests
{
    private sealed class FixedClock(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
    }

    private static CardQueryService CreateService() =>
        new(new InMemoryCardReader(), new FixedClock(new DateTimeOffset(2026, 10, 7, 0, 0, 0, TimeSpan.Zero)));

    [Fact]
    public void List_GivenCustomerWithCards_ReturnsOnlyTheirCardsMasked()
    {
        var result = CreateService().List("cust-001", null, 1, 10);

        Assert.Equal(3, result.Total);
        Assert.All(result.Items, i => Assert.StartsWith("**** **** **** ", i.MaskedNumber));
    }

    [Fact]
    public void List_GivenStatusFilter_ReturnsMatchingCardsOnly()
    {
        var result = CreateService().List("cust-001", "blocked", 1, 10);

        var item = Assert.Single(result.Items);
        Assert.Equal("card-003", item.Id);
    }

    [Fact]
    public void List_GivenPagination_ReturnsRequestedSlice()
    {
        var result = CreateService().List("cust-001", null, 2, 2);

        Assert.Single(result.Items);
        Assert.Equal(3, result.Total);
    }

    [Fact]
    public void List_GivenUnknownCustomer_ReturnsEmpty()
    {
        Assert.Empty(CreateService().List("nadie", null, 1, 10).Items);
    }

    [Theory]
    [InlineData("", "Active", 1, 10)]
    [InlineData("cust-001", "Bogus", 1, 10)]
    [InlineData("cust-001", null, 0, 10)]
    [InlineData("cust-001", null, 1, 0)]
    [InlineData("cust-001", null, 1, 51)]
    public void List_GivenInvalidParameters_ThrowsInvalidQuery(string customer, string? status, int page, int size)
    {
        Assert.Throws<InvalidQueryException>(() => CreateService().List(customer, status, page, size));
    }

    [Fact]
    public void Get_GivenExistingCard_ReturnsDetailAndExpiringFlag()
    {
        var detail = CreateService().Get("cust-001", "card-002");

        Assert.Equal("**** **** **** 2222", detail.MaskedNumber);
        Assert.Equal(5000m, detail.CreditLimit.Amount);
        Assert.True(detail.ExpiresSoon);
        Assert.Equal("11/26", detail.ExpiryDate);
    }

    [Fact]
    public void Get_GivenFarExpiry_ExpiresSoonIsFalse()
    {
        Assert.False(CreateService().Get("cust-001", "card-001").ExpiresSoon);
    }

    [Fact]
    public void Get_GivenCardOfAnotherCustomer_ThrowsNotFound()
    {
        Assert.Throws<CardNotFoundException>(() => CreateService().Get("cust-001", "card-004"));
    }
}

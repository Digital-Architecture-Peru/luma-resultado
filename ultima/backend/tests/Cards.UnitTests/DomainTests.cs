using Cards.Domain;
using Xunit;

namespace Cards.UnitTests;

public class MoneyTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void Create_NonPositiveAmount_Throws(int amount)
    {
        Assert.Throws<DomainException>(() => Money.Create(amount, "USD"));
    }

    [Fact]
    public void Create_MoreThanTwoDecimals_Throws()
    {
        Assert.Throws<DomainException>(() => Money.Create(10.123m, "USD"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("US")]
    [InlineData("US1")]
    [InlineData(null)]
    public void Create_InvalidCurrency_Throws(string? currency)
    {
        Assert.Throws<DomainException>(() => Money.Create(10m, currency));
    }

    [Fact]
    public void Create_ValidValues_NormalizesCurrency()
    {
        var money = Money.Create(10.50m, " usd ");

        Assert.Equal(10.50m, money.Amount);
        Assert.Equal("USD", money.Currency);
    }
}

public class CardTransactionTests
{
    private static CardTransaction NewPending() =>
        CardTransaction.Create(Guid.NewGuid(), Money.Create(25m, "USD"), "key-12345678", DateTimeOffset.UnixEpoch);

    [Fact]
    public void Create_StartsPending()
    {
        Assert.Equal(TransactionStatus.Pending, NewPending().Status);
    }

    [Fact]
    public void Create_EmptyCard_Throws()
    {
        Assert.Throws<DomainException>(() =>
            CardTransaction.Create(Guid.Empty, Money.Create(1m, "USD"), "key-12345678", DateTimeOffset.UnixEpoch));
    }

    [Fact]
    public void Approve_FromPending_SetsApproved()
    {
        var tx = NewPending();
        tx.Approve();
        Assert.Equal(TransactionStatus.Approved, tx.Status);
    }

    [Fact]
    public void Reject_FromPending_StoresReason()
    {
        var tx = NewPending();
        tx.Reject("Sin fondos");

        Assert.Equal(TransactionStatus.Rejected, tx.Status);
        Assert.Equal("Sin fondos", tx.RejectionReason);
    }

    [Fact]
    public void Reject_WithoutReason_Throws()
    {
        Assert.Throws<DomainException>(() => NewPending().Reject(" "));
    }

    [Fact]
    public void Approve_AfterRejected_Throws()
    {
        var tx = NewPending();
        tx.Reject("Sin fondos");
        Assert.Throws<DomainException>(() => tx.Approve());
    }

    [Fact]
    public void Reject_AfterApproved_Throws()
    {
        var tx = NewPending();
        tx.Approve();
        Assert.Throws<DomainException>(() => tx.Reject("tarde"));
    }
}

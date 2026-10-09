using Cuentas.Domain;
using Xunit;

namespace Cuentas.UnitTests;

public class DomainTests
{
    private static Account Acc(long id, decimal balance, string currency = "USD") =>
        new(id, $"00{id}", "Titular Ficticio", currency, balance);

    [Fact]
    public void GivenValidTransfer_WhenApplied_ThenDebitAndCreditBalance()
    {
        var source = Acc(1, 100m);
        var target = Acc(2, 50m);

        TransferRules.Apply(source, target, 30.25m);

        Assert.Equal(69.75m, source.Balance);
        Assert.Equal(80.25m, target.Balance);
        Assert.Equal(150m, source.Balance + target.Balance);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(1.005)]
    public void GivenInvalidAmount_WhenApplied_ThenValidationErrorAndNoChange(double raw)
    {
        var source = Acc(1, 100m);
        var target = Acc(2, 50m);

        var ex = Assert.Throws<DomainException>(() => TransferRules.Apply(source, target, (decimal)raw));

        Assert.Equal(ErrorCodes.Validation, ex.Code);
        Assert.Equal(100m, source.Balance);
        Assert.Equal(50m, target.Balance);
    }

    [Fact]
    public void GivenSameAccount_WhenApplied_ThenSameAccountError()
    {
        var account = Acc(1, 100m);

        var ex = Assert.Throws<DomainException>(() => TransferRules.Apply(account, account, 10m));

        Assert.Equal(ErrorCodes.SameAccount, ex.Code);
    }

    [Fact]
    public void GivenDifferentCurrencies_WhenApplied_ThenCurrencyMismatch()
    {
        var ex = Assert.Throws<DomainException>(
            () => TransferRules.Apply(Acc(1, 100m, "USD"), Acc(2, 50m, "EUR"), 10m));

        Assert.Equal(ErrorCodes.CurrencyMismatch, ex.Code);
    }

    [Fact]
    public void GivenInsufficientFunds_WhenApplied_ThenErrorAndBalancesUntouched()
    {
        var source = Acc(1, 10m);
        var target = Acc(2, 0m);

        var ex = Assert.Throws<DomainException>(() => TransferRules.Apply(source, target, 10.01m));

        Assert.Equal(ErrorCodes.InsufficientFunds, ex.Code);
        Assert.Equal(10m, source.Balance);
        Assert.Equal(0m, target.Balance);
    }

    [Fact]
    public void GivenExactBalance_WhenApplied_ThenSourceReachesZero()
    {
        var source = Acc(1, 10m);

        TransferRules.Apply(source, Acc(2, 0m), 10m);

        Assert.Equal(0m, source.Balance);
    }
}

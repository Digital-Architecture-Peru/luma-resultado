using Payments.Application;
using Payments.Domain;

namespace Payments.UnitTests;

public class PaymentServiceTests
{
    private static readonly Account Source =
        new(Guid.Parse("11111111-1111-4111-8111-111111111111"), "ACC00000001", "Ana Ficticia", "USD", 1000m);

    private static PaymentRequest Request(decimal amount = 100m) =>
        new(Source.Id, "ACC00000009", amount, "USD", "Alquiler");

    private static (PaymentService Service, InMemoryPaymentRepository Repo) Build(bool approve = true)
    {
        var repo = new InMemoryPaymentRepository(Source);
        var service = new PaymentService(repo, new StubGateway(approve), new PaymentOptions(), TimeProvider.System);
        return (service, repo);
    }

    [Fact]
    public async Task GivenApprovedGateway_WhenCreate_ThenCompletedAndSaved()
    {
        var (service, repo) = Build();

        var payment = await service.CreateAsync(Request(), "key-1", CancellationToken.None);

        Assert.Equal(PaymentStatus.Completed, payment.Status);
        Assert.Equal(1, repo.SaveCalls);
    }

    [Fact]
    public async Task GivenRejectingGateway_WhenCreate_ThenRejected()
    {
        var (service, _) = Build(approve: false);

        var payment = await service.CreateAsync(Request(), "key-1", CancellationToken.None);

        Assert.Equal(PaymentStatus.Rejected, payment.Status);
    }

    [Fact]
    public async Task GivenSameKeyAndPayload_WhenCreateTwice_ThenReturnsOriginalWithoutSavingAgain()
    {
        var (service, repo) = Build();

        var first = await service.CreateAsync(Request(), "key-1", CancellationToken.None);
        var second = await service.CreateAsync(Request(), "key-1", CancellationToken.None);

        Assert.Equal(first.Id, second.Id);
        Assert.Equal(1, repo.SaveCalls);
    }

    [Fact]
    public async Task GivenSameKeyAndDifferentPayload_WhenCreate_ThenConflict()
    {
        var (service, _) = Build();
        await service.CreateAsync(Request(), "key-1", CancellationToken.None);

        await Assert.ThrowsAsync<IdempotencyConflictException>(
            () => service.CreateAsync(Request(amount: 200m), "key-1", CancellationToken.None));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GivenMissingKey_WhenCreate_ThenDomainException(string? key)
    {
        var (service, _) = Build();

        await Assert.ThrowsAsync<DomainException>(() => service.CreateAsync(Request(), key, CancellationToken.None));
    }

    [Fact]
    public async Task GivenUnknownSourceAccount_WhenCreate_ThenDomainException()
    {
        var (service, _) = Build();
        var request = Request() with { SourceAccountId = Guid.NewGuid() };

        await Assert.ThrowsAsync<DomainException>(() => service.CreateAsync(request, "key-1", CancellationToken.None));
    }

    [Fact]
    public async Task GivenInsufficientFunds_WhenCreate_ThenNothingIsSaved()
    {
        var (service, repo) = Build();

        await Assert.ThrowsAsync<DomainException>(
            () => service.CreateAsync(Request(amount: 2000m), "key-1", CancellationToken.None));

        Assert.Equal(0, repo.SaveCalls);
    }
}

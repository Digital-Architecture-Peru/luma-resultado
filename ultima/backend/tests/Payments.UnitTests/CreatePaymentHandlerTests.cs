using Payments.Application;
using Payments.Infrastructure;
using Xunit;

namespace Payments.UnitTests;

public class CreatePaymentHandlerTests
{
    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _now;
        public FixedTimeProvider(DateTimeOffset now) => _now = now;
        public override DateTimeOffset GetUtcNow() => _now;
    }

    private const string Customer = "C-1001";

    private static (CreatePaymentHandler Handler, InMemoryPaymentRepository Repo) Build(decimal max = 10000m)
    {
        var repo = new InMemoryPaymentRepository();
        var handler = new CreatePaymentHandler(
            repo, new FakePaymentProcessor(), new PaymentPolicy(max),
            new FixedTimeProvider(new DateTimeOffset(2026, 1, 15, 10, 0, 0, TimeSpan.Zero)));
        return (handler, repo);
    }

    private static CreatePaymentRequest Request(decimal amount = 150.75m, string beneficiary = "00200000000002") =>
        new("00100000000001", beneficiary, amount, "PEN", "Pago de servicio");

    [Fact]
    public async Task GivenValidRequest_WhenHandle_ThenCompletedAndPersisted()
    {
        var (handler, repo) = Build();

        var response = await handler.HandleAsync(Customer, "key-ok", Request(), CancellationToken.None);

        Assert.Equal("COMPLETED", response.Status);
        var stored = await repo.GetByIdAsync(response.Id, Customer, CancellationToken.None);
        Assert.NotNull(stored);
        Assert.Equal(150.75m, stored!.Amount);
    }

    [Fact]
    public async Task GivenProcessorDeclines_WhenHandle_ThenRejectedWithReason()
    {
        var (handler, _) = Build();

        var response = await handler.HandleAsync(Customer, "key-rej", Request(beneficiary: "00200000000000"), CancellationToken.None);

        Assert.Equal("REJECTED", response.Status);
        Assert.False(string.IsNullOrWhiteSpace(response.FailureReason));
    }

    [Fact]
    public async Task GivenSameIdempotencyKey_WhenHandleTwice_ThenDuplicateConflict()
    {
        var (handler, repo) = Build();
        var first = await handler.HandleAsync(Customer, "key-dup", Request(), CancellationToken.None);

        await Assert.ThrowsAsync<DuplicateIdempotencyKeyException>(
            () => handler.HandleAsync(Customer, "key-dup", Request(), CancellationToken.None));

        var list = await repo.ListByAccountAsync(Customer, first.SourceAccountId, CancellationToken.None);
        Assert.Single(list);
    }

    [Fact]
    public async Task GivenAmountAboveLimit_WhenHandle_ThenValidationError()
    {
        var (handler, _) = Build(max: 1000m);

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Customer, "key-big", Request(amount: 1000.01m), CancellationToken.None));

        Assert.Contains("amount", ex.Errors.Keys);
    }

    [Fact]
    public async Task GivenNonPositiveAmountAndSameAccounts_WhenHandle_ThenReportsAllErrors()
    {
        var (handler, _) = Build();
        var bad = new CreatePaymentRequest("00100000000001", "00100000000001", 0m, "PEN", "x");

        var ex = await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Customer, "key-bad", bad, CancellationToken.None));

        Assert.Contains("amount", ex.Errors.Keys);
        Assert.Contains("beneficiaryAccount", ex.Errors.Keys);
    }

    [Fact]
    public async Task GivenMissingIdempotencyKey_WhenHandle_ThenValidationError()
    {
        var (handler, _) = Build();

        await Assert.ThrowsAsync<RequestValidationException>(
            () => handler.HandleAsync(Customer, " ", Request(), CancellationToken.None));
    }

    [Fact]
    public async Task GivenOtherCustomer_WhenGetById_ThenNotVisible()
    {
        var (handler, repo) = Build();
        var response = await handler.HandleAsync(Customer, "key-own", Request(), CancellationToken.None);

        var stored = await repo.GetByIdAsync(response.Id, "C-9999", CancellationToken.None);

        Assert.Null(stored);
    }
}

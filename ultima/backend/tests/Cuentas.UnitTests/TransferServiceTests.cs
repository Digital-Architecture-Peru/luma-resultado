using Cuentas.Application;
using Cuentas.Domain;
using Xunit;

namespace Cuentas.UnitTests;

internal sealed class FakeStore
{
    public Dictionary<long, Account> Accounts { get; } = new();
    public Dictionary<string, TransferResult> Transfers { get; } = new();
    public int Commits { get; set; }
    public long LastLockedFirstId { get; set; }
}

internal sealed class FakeFactory : ITransferUnitOfWorkFactory
{
    private readonly FakeStore _store;

    public FakeFactory(FakeStore store) => _store = store;

    public Task<ITransferUnitOfWork> BeginAsync(CancellationToken ct) =>
        Task.FromResult<ITransferUnitOfWork>(new FakeUnitOfWork(_store));
}

internal sealed class FakeUnitOfWork : ITransferUnitOfWork
{
    private readonly FakeStore _store;

    public FakeUnitOfWork(FakeStore store) => _store = store;

    public Task<TransferResult?> FindByKeyAsync(string key, CancellationToken ct) =>
        Task.FromResult(_store.Transfers.GetValueOrDefault(key));

    public Task<IReadOnlyList<Account>> LockAccountsAsync(IReadOnlyCollection<long> ids, CancellationToken ct)
    {
        _store.LastLockedFirstId = ids.First();
        IReadOnlyList<Account> found = ids.Where(_store.Accounts.ContainsKey).Select(id => _store.Accounts[id]).ToList();
        return Task.FromResult(found);
    }

    public Task<TransferResult> RecordTransferAsync(TransferCommand c, Account source, Account target, CancellationToken ct)
    {
        var result = new TransferResult(
            _store.Transfers.Count + 1, source.Id, target.Id, c.Amount, "COMPLETED", DateTimeOffset.UnixEpoch);
        _store.Transfers[c.IdempotencyKey] = result;
        return Task.FromResult(result);
    }

    public Task CommitAsync(CancellationToken ct)
    {
        _store.Commits++;
        return Task.CompletedTask;
    }

    public ValueTask DisposeAsync() => ValueTask.CompletedTask;
}

public class TransferServiceTests
{
    private readonly FakeStore _store = new();
    private readonly TransferService _service;

    public TransferServiceTests()
    {
        _store.Accounts[1] = new Account(1, "001", "Titular Uno", "USD", 100m);
        _store.Accounts[2] = new Account(2, "002", "Titular Dos", "USD", 50m);
        _service = new TransferService(new FakeFactory(_store));
    }

    private static TransferCommand Cmd(long src, long tgt, decimal amount, string key = "key-1") =>
        new(src, tgt, amount, "pago", key);

    [Fact]
    public async Task GivenValidCommand_WhenExecuted_ThenBalancesMoveAndCommitOnce()
    {
        var result = await _service.ExecuteAsync(Cmd(1, 2, 40m));

        Assert.False(result.Replayed);
        Assert.Equal(60m, _store.Accounts[1].Balance);
        Assert.Equal(90m, _store.Accounts[2].Balance);
        Assert.Equal(1, _store.Commits);
    }

    [Fact]
    public async Task GivenSourceGreaterThanTarget_WhenExecuted_ThenLocksInAscendingOrder()
    {
        await _service.ExecuteAsync(Cmd(2, 1, 10m));

        Assert.Equal(1, _store.LastLockedFirstId);
    }

    [Fact]
    public async Task GivenSameKeyAndPayload_WhenRepeated_ThenReplayedWithoutSecondDebit()
    {
        await _service.ExecuteAsync(Cmd(1, 2, 40m));

        var second = await _service.ExecuteAsync(Cmd(1, 2, 40m));

        Assert.True(second.Replayed);
        Assert.Equal(60m, _store.Accounts[1].Balance);
        Assert.Equal(1, _store.Commits);
    }

    [Fact]
    public async Task GivenSameKeyDifferentPayload_WhenRepeated_ThenDuplicateConflict()
    {
        await _service.ExecuteAsync(Cmd(1, 2, 40m));

        var ex = await Assert.ThrowsAsync<DomainException>(() => _service.ExecuteAsync(Cmd(1, 2, 41m)));

        Assert.Equal(ErrorCodes.DuplicateRequest, ex.Code);
    }

    [Fact]
    public async Task GivenInsufficientFunds_WhenExecuted_ThenNoCommitAndBalancesUntouched()
    {
        var ex = await Assert.ThrowsAsync<DomainException>(() => _service.ExecuteAsync(Cmd(1, 2, 500m)));

        Assert.Equal(ErrorCodes.InsufficientFunds, ex.Code);
        Assert.Equal(0, _store.Commits);
        Assert.Equal(100m, _store.Accounts[1].Balance);
    }

    [Fact]
    public async Task GivenUnknownTarget_WhenExecuted_ThenAccountNotFound()
    {
        var ex = await Assert.ThrowsAsync<DomainException>(() => _service.ExecuteAsync(Cmd(1, 99, 5m)));

        Assert.Equal(ErrorCodes.AccountNotFound, ex.Code);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GivenBlankIdempotencyKey_WhenExecuted_ThenValidationError(string key)
    {
        var ex = await Assert.ThrowsAsync<DomainException>(() => _service.ExecuteAsync(Cmd(1, 2, 5m, key)));

        Assert.Equal(ErrorCodes.Validation, ex.Code);
    }

    [Fact]
    public async Task GivenSameSourceAndTarget_WhenExecuted_ThenSameAccountError()
    {
        var ex = await Assert.ThrowsAsync<DomainException>(() => _service.ExecuteAsync(Cmd(1, 1, 5m)));

        Assert.Equal(ErrorCodes.SameAccount, ex.Code);
    }
}

using Cuentas.Domain;

namespace Cuentas.Application;

public sealed record TransferCommand(
    long SourceAccountId,
    long TargetAccountId,
    decimal Amount,
    string? Description,
    string IdempotencyKey);

public sealed record TransferResult(
    long TransferId,
    long SourceAccountId,
    long TargetAccountId,
    decimal Amount,
    string Status,
    DateTimeOffset CreatedAt,
    bool Replayed = false);

/// <summary>Consultas de cuentas y movimientos.</summary>
public interface IAccountRepository
{
    Task<IReadOnlyList<Account>> ListAsync(CancellationToken ct);
    Task<Account?> FindAsync(long id, CancellationToken ct);
    Task<IReadOnlyList<LedgerEntry>> ListEntriesAsync(long accountId, int limit, CancellationToken ct);
}

/// <summary>Unidad de trabajo transaccional de una transferencia. Sin CommitAsync se revierte.</summary>
public interface ITransferUnitOfWork : IAsyncDisposable
{
    Task<TransferResult?> FindByKeyAsync(string idempotencyKey, CancellationToken ct);

    /// <summary>Bloquea y devuelve las cuentas pedidas, en orden ascendente de id.</summary>
    Task<IReadOnlyList<Account>> LockAccountsAsync(IReadOnlyCollection<long> ascendingIds, CancellationToken ct);

    /// <summary>Persiste saldos ya actualizados, la transferencia y sus dos movimientos.</summary>
    Task<TransferResult> RecordTransferAsync(TransferCommand command, Account source, Account target, CancellationToken ct);

    Task CommitAsync(CancellationToken ct);
}

public interface ITransferUnitOfWorkFactory
{
    Task<ITransferUnitOfWork> BeginAsync(CancellationToken ct);
}

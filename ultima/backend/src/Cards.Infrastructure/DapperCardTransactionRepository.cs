using Cards.Application;
using Cards.Domain;
using Dapper;
using Npgsql;

namespace Cards.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL parametrizado (Dapper).</summary>
public sealed class DapperCardTransactionRepository : ICardTransactionRepository
{
    private const string SelectTransaction = @"
        SELECT id AS Id, card_id AS CardId, amount AS Amount, currency AS Currency,
               status AS Status, idempotency_key AS IdempotencyKey,
               created_at AS CreatedAt, rejection_reason AS RejectionReason
        FROM card_transactions";

    private readonly NpgsqlDataSource _dataSource;

    public DapperCardTransactionRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<IReadOnlyList<CardSummary>> ListCardsAsync(CancellationToken ct)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<CardSummary>(new CommandDefinition(
            @"SELECT id AS Id, masked_pan AS MaskedPan, holder_alias AS HolderAlias
              FROM cards WHERE status = 'ACTIVE' ORDER BY holder_alias",
            cancellationToken: ct));
        return rows.ToList();
    }

    public async Task<bool> CardIsActiveAsync(Guid cardId, CancellationToken ct)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition(
            "SELECT EXISTS (SELECT 1 FROM cards WHERE id = @cardId AND status = 'ACTIVE')",
            new { cardId },
            cancellationToken: ct));
    }

    public async Task<CardTransaction?> FindByIdempotencyKeyAsync(string key, CancellationToken ct)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        var row = await connection.QuerySingleOrDefaultAsync<TransactionRow>(new CommandDefinition(
            SelectTransaction + " WHERE idempotency_key = @key",
            new { key },
            cancellationToken: ct));
        return row?.ToDomain();
    }

    public async Task<bool> TryAddAsync(CardTransaction transaction, CancellationToken ct)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        var affected = await connection.ExecuteAsync(new CommandDefinition(
            @"INSERT INTO card_transactions
                (id, card_id, amount, currency, status, idempotency_key, created_at, rejection_reason)
              VALUES (@Id, @CardId, @Amount, @Currency, @Status, @IdempotencyKey, @CreatedAt, @RejectionReason)
              ON CONFLICT (idempotency_key) DO NOTHING",
            new
            {
                transaction.Id,
                transaction.CardId,
                transaction.Amount.Amount,
                transaction.Amount.Currency,
                Status = transaction.Status.ToString().ToUpperInvariant(),
                transaction.IdempotencyKey,
                CreatedAt = transaction.CreatedAt.UtcDateTime,
                transaction.RejectionReason
            },
            cancellationToken: ct));
        return affected == 1;
    }

    public async Task<IReadOnlyList<CardTransaction>> ListByCardAsync(Guid cardId, int limit, CancellationToken ct)
    {
        await using var connection = await _dataSource.OpenConnectionAsync(ct);
        var rows = await connection.QueryAsync<TransactionRow>(new CommandDefinition(
            SelectTransaction + " WHERE card_id = @cardId ORDER BY created_at DESC LIMIT @limit",
            new { cardId, limit },
            cancellationToken: ct));
        return rows.Select(r => r.ToDomain()).ToList();
    }

    private sealed class TransactionRow
    {
        public Guid Id { get; set; }
        public Guid CardId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string IdempotencyKey { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? RejectionReason { get; set; }

        public CardTransaction ToDomain() => CardTransaction.Restore(
            Id,
            CardId,
            Money.Create(Amount, Currency),
            Enum.Parse<TransactionStatus>(Status, ignoreCase: true),
            IdempotencyKey,
            new DateTimeOffset(DateTime.SpecifyKind(CreatedAt, DateTimeKind.Utc)),
            RejectionReason);
    }
}

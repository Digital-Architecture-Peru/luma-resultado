using Cards.Application;
using Cards.Domain;
using Dapper;
using Npgsql;

namespace Cards.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL parametrizado (Dapper).</summary>
public sealed class NpgsqlCardTransactionRepository(NpgsqlDataSource dataSource) : ICardTransactionRepository
{
    private const string CardColumns =
        "id AS Id, masked_pan AS MaskedPan, alias AS Alias, credit_limit AS CreditLimit, " +
        "available_balance AS AvailableBalance, currency AS Currency";

    private const string TransactionColumns =
        "id AS Id, card_id AS CardId, type AS Type, amount AS Amount, currency AS Currency, " +
        "status AS Status, idempotency_key AS IdempotencyKey, created_at AS CreatedAt";

    public async Task<IReadOnlyList<Card>> ListCardsAsync(CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<Card>(new CommandDefinition(
            $"SELECT {CardColumns} FROM cards ORDER BY alias", cancellationToken: ct));
        return rows.ToList();
    }

    public async Task<Card?> FindCardAsync(Guid cardId, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        return await conn.QuerySingleOrDefaultAsync<Card>(new CommandDefinition(
            $"SELECT {CardColumns} FROM cards WHERE id = @cardId", new { cardId }, cancellationToken: ct));
    }

    public async Task<IReadOnlyList<CardTransaction>> ListTransactionsAsync(
        Guid cardId, int offset, int limit, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        var rows = await conn.QueryAsync<CardTransaction>(new CommandDefinition(
            $"SELECT {TransactionColumns} FROM card_transactions WHERE card_id = @cardId " +
            "ORDER BY created_at DESC LIMIT @limit OFFSET @offset",
            new { cardId, limit, offset }, cancellationToken: ct));
        return rows.ToList();
    }

    public async Task<CardTransaction?> FindByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        return await conn.QuerySingleOrDefaultAsync<CardTransaction>(new CommandDefinition(
            $"SELECT {TransactionColumns} FROM card_transactions WHERE idempotency_key = @idempotencyKey",
            new { idempotencyKey }, cancellationToken: ct));
    }

    public async Task<ApplyPaymentResult> ApplyPaymentAsync(CardTransaction payment, CancellationToken ct)
    {
        await using var conn = await dataSource.OpenConnectionAsync(ct);
        await using var tx = await conn.BeginTransactionAsync(ct);

        // Actualización condicional: nunca deja el saldo disponible por encima del límite.
        var updated = await conn.ExecuteAsync(new CommandDefinition(
            "UPDATE cards SET available_balance = available_balance + @Amount " +
            "WHERE id = @CardId AND currency = @Currency AND available_balance + @Amount <= credit_limit",
            new { payment.Amount, payment.CardId, payment.Currency }, tx, cancellationToken: ct));
        if (updated == 0)
            return ApplyPaymentResult.ExceedsOutstanding;

        try
        {
            await conn.ExecuteAsync(new CommandDefinition(
                "INSERT INTO card_transactions (id, card_id, type, amount, currency, status, idempotency_key, created_at) " +
                "VALUES (@Id, @CardId, @Type, @Amount, @Currency, @Status, @IdempotencyKey, @CreatedAt)",
                payment, tx, cancellationToken: ct));
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            return ApplyPaymentResult.DuplicateKey; // la transacción se revierte al liberarse
        }

        await tx.CommitAsync(ct);
        return ApplyPaymentResult.Applied;
    }
}

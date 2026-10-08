using Cards.Application;
using Cards.Domain;
using Npgsql;

namespace Cards.Infrastructure;

/// <summary>Lectura en PostgreSQL con SQL parametrizado (nunca concatenado).</summary>
public sealed class NpgsqlCardQueryRepository(NpgsqlDataSource dataSource) : ICardQueryRepository
{
    private const string CardColumns =
        "id, customer_id, last4, brand, product, status, credit_limit, available, currency, expiry_month, expiry_year";

    public async Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct)
    {
        await using var cmd = dataSource.CreateCommand(
            $"SELECT {CardColumns} FROM cards WHERE customer_id = @customerId ORDER BY product, last4");
        cmd.Parameters.AddWithValue("customerId", customerId);

        var result = new List<Card>();
        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            result.Add(MapCard(reader));
        }

        return result;
    }

    public async Task<Card?> FindAsync(Guid customerId, Guid cardId, CancellationToken ct)
    {
        await using var cmd = dataSource.CreateCommand(
            $"SELECT {CardColumns} FROM cards WHERE id = @cardId AND customer_id = @customerId");
        cmd.Parameters.AddWithValue("cardId", cardId);
        cmd.Parameters.AddWithValue("customerId", customerId);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        return await reader.ReadAsync(ct) ? MapCard(reader) : null;
    }

    public async Task<(IReadOnlyList<CardMovement> Items, int Total)> ListMovementsAsync(
        Guid cardId, int offset, int limit, CancellationToken ct)
    {
        await using var connection = await dataSource.OpenConnectionAsync(ct);

        int total;
        await using (var count = new NpgsqlCommand(
            "SELECT count(*) FROM card_movements WHERE card_id = @cardId", connection))
        {
            count.Parameters.AddWithValue("cardId", cardId);
            total = Convert.ToInt32(await count.ExecuteScalarAsync(ct));
        }

        var items = new List<CardMovement>();
        await using var cmd = new NpgsqlCommand(
            "SELECT id, card_id, posted_at, description, amount, currency FROM card_movements " +
            "WHERE card_id = @cardId ORDER BY posted_at DESC OFFSET @offset LIMIT @limit", connection);
        cmd.Parameters.AddWithValue("cardId", cardId);
        cmd.Parameters.AddWithValue("offset", offset);
        cmd.Parameters.AddWithValue("limit", limit);

        await using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            items.Add(new CardMovement(
                reader.GetGuid(0),
                reader.GetGuid(1),
                reader.GetFieldValue<DateTimeOffset>(2),
                reader.GetString(3),
                reader.GetDecimal(4),
                reader.GetString(5).Trim()));
        }

        return (items, total);
    }

    private static Card MapCard(NpgsqlDataReader r) => new(
        r.GetGuid(0),
        r.GetGuid(1),
        r.GetString(2).Trim(),
        r.GetString(3),
        r.GetString(4),
        Enum.Parse<CardStatus>(r.GetString(5), ignoreCase: true),
        r.GetDecimal(6),
        r.GetDecimal(7),
        r.GetString(8).Trim(),
        r.GetInt32(9),
        r.GetInt32(10));
}

using Cards.Application;
using Cards.Domain;
using Dapper;
using Npgsql;

namespace Cards.Infrastructure;

/// <summary>Adaptador PostgreSQL de solo lectura. Todas las consultas están parametrizadas.</summary>
public sealed class PostgresCardRepository : ICardRepository
{
    private const string Columns =
        "id AS Id, customer_id AS CustomerId, product_name AS ProductName, brand AS Brand, " +
        "masked_pan AS MaskedPan, last4 AS Last4, status AS Status, credit_limit AS CreditLimit, " +
        "available_balance AS AvailableBalance, currency AS Currency, expiry AS Expiry";

    private const string ListSql =
        "SELECT " + Columns + " FROM cards WHERE customer_id = @customerId ORDER BY created_at, id";

    private const string FindSql =
        "SELECT " + Columns + " FROM cards WHERE id = @cardId";

    private readonly string _connectionString;

    public PostgresCardRepository(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("La cadena de conexión es obligatoria.", nameof(connectionString));
        }

        _connectionString = connectionString;
    }

    public async Task<IReadOnlyList<Card>> ListByCustomerAsync(string customerId, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        var command = new CommandDefinition(ListSql, new { customerId }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<CardRow>(command);
        return rows.Select(ToCard).ToList();
    }

    public async Task<Card?> FindByIdAsync(Guid cardId, CancellationToken cancellationToken)
    {
        await using var connection = new NpgsqlConnection(_connectionString);
        var command = new CommandDefinition(FindSql, new { cardId }, cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<CardRow>(command);
        return row is null ? null : ToCard(row);
    }

    private static Card ToCard(CardRow row) => new(
        row.Id,
        row.CustomerId,
        row.ProductName,
        row.Brand,
        row.MaskedPan,
        row.Last4,
        Enum.Parse<CardStatus>(row.Status, ignoreCase: true),
        row.CreditLimit,
        row.AvailableBalance,
        row.Currency,
        row.Expiry);

    private sealed class CardRow
    {
        public Guid Id { get; set; }
        public string CustomerId { get; set; } = "";
        public string ProductName { get; set; } = "";
        public string Brand { get; set; } = "";
        public string MaskedPan { get; set; } = "";
        public string Last4 { get; set; } = "";
        public string Status { get; set; } = "";
        public decimal CreditLimit { get; set; }
        public decimal AvailableBalance { get; set; }
        public string Currency { get; set; } = "";
        public string Expiry { get; set; } = "";
    }
}

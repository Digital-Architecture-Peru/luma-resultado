using Cards.Application;
using Dapper;
using Npgsql;

namespace Cards.Infrastructure;

/// <summary>Adaptador de solo lectura sobre PostgreSQL con consultas parametrizadas.</summary>
public sealed class PostgresCardRepository : ICardRepository
{
    private const string Columns = """
        id AS Id, customer_id AS CustomerId, pan_last4 AS PanLast4, brand AS Brand,
        card_type AS CardType, status AS Status, credit_limit AS CreditLimit,
        available_balance AS AvailableBalance, currency AS Currency,
        expiry_month AS ExpiryMonth, expiry_year AS ExpiryYear
        """;

    private readonly string _connectionString;

    public PostgresCardRepository(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new ArgumentException("Falta la cadena de conexión (CARDS_DB_CONNECTION).", nameof(connectionString));
        }

        _connectionString = connectionString;
    }

    public async Task<IReadOnlyList<Card>> ListByCustomerAsync(Guid customerId, CancellationToken ct)
    {
        var sql = $"SELECT {Columns} FROM cards WHERE customer_id = @customerId ORDER BY created_at, id";
        await using var connection = new NpgsqlConnection(_connectionString);
        var rows = await connection.QueryAsync<CardRow>(new CommandDefinition(sql, new { customerId }, cancellationToken: ct));
        return rows.Select(r => r.ToCard()).ToList();
    }

    public async Task<Card?> FindByIdAsync(Guid cardId, CancellationToken ct)
    {
        var sql = $"SELECT {Columns} FROM cards WHERE id = @cardId";
        await using var connection = new NpgsqlConnection(_connectionString);
        var row = await connection.QuerySingleOrDefaultAsync<CardRow>(new CommandDefinition(sql, new { cardId }, cancellationToken: ct));
        return row?.ToCard();
    }

    private sealed class CardRow
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string PanLast4 { get; set; } = "";
        public string Brand { get; set; } = "";
        public string CardType { get; set; } = "";
        public string Status { get; set; } = "";
        public decimal CreditLimit { get; set; }
        public decimal AvailableBalance { get; set; }
        public string Currency { get; set; } = "";
        public int ExpiryMonth { get; set; }
        public int ExpiryYear { get; set; }

        public Card ToCard() => new(Id, CustomerId, PanLast4, Brand, CardType, Status,
            CreditLimit, AvailableBalance, Currency, ExpiryMonth, ExpiryYear);
    }
}

using CardsQuery.Api.Domain;

namespace CardsQuery.Api.Adapters;

/// <summary>Adaptador con datos ficticios. Sustituir por el adaptador de integración real cuando se defina.</summary>
public sealed class InMemoryCardReader : ICardReader
{
    private static readonly IReadOnlyList<Card> Cards =
    [
        new("card-001", "cust-001", "ANA PEREZ", "4000123412341111", CardType.Debit, CardStatus.Active, "USD", 0m, 1520.55m, new DateOnly(2028, 5, 31)),
        new("card-002", "cust-001", "ANA PEREZ", "5500123412342222", CardType.Credit, CardStatus.Active, "USD", 5000m, 3200m, new DateOnly(2026, 11, 30)),
        new("card-003", "cust-001", "ANA PEREZ", "4000123412343333", CardType.Credit, CardStatus.Blocked, "USD", 2000m, 0m, new DateOnly(2027, 2, 28)),
        new("card-004", "cust-002", "LUIS GOMEZ", "5500123412344444", CardType.Debit, CardStatus.Expired, "USD", 0m, 80m, new DateOnly(2024, 1, 31))
    ];

    public IReadOnlyList<Card> FindByCustomer(string customerId) =>
        Cards.Where(c => c.CustomerId == customerId).ToList();
}

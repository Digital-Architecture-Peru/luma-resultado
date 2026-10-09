using Cards.Domain;

namespace Cards.Infrastructure;

/// <summary>Datos ficticios. Deben coincidir con db/migrations/V002__seed.sql.</summary>
public static class DemoCards
{
    public static IReadOnlyList<Card> All { get; } = new List<Card>
    {
        new(Guid.Parse("11111111-1111-1111-1111-111111111101"), "demo-001", "Visa Platinum", "VISA",
            PanMasker.FromLast4("4821"), "4821", CardStatus.Active, 15000.00m, 11250.75m, "USD", "12/28"),
        new(Guid.Parse("11111111-1111-1111-1111-111111111102"), "demo-001", "Mastercard Gold", "MASTERCARD",
            PanMasker.FromLast4("0937"), "0937", CardStatus.Blocked, 8000.00m, 2300.10m, "USD", "05/27"),
        new(Guid.Parse("11111111-1111-1111-1111-111111111103"), "demo-002", "Visa Classic", "VISA",
            PanMasker.FromLast4("1156"), "1156", CardStatus.Active, 3000.00m, 2750.00m, "PEN", "09/29"),
    };
}

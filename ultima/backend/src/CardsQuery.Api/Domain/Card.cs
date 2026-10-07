namespace CardsQuery.Api.Domain;

public enum CardStatus
{
    Active,
    Blocked,
    Expired
}

public enum CardType
{
    Debit,
    Credit
}

/// <summary>Tarjeta del dominio. Los datos son ficticios.</summary>
public sealed record Card(
    string Id,
    string CustomerId,
    string HolderName,
    string Number,
    CardType Type,
    CardStatus Status,
    string Currency,
    decimal CreditLimit,
    decimal AvailableBalance,
    DateOnly ExpiryDate);

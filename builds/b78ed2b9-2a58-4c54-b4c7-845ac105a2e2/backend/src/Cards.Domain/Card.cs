namespace Cards.Domain;

/// <summary>Tarjeta de crédito. Solo se conserva el PAN enmascarado.</summary>
public sealed record Card(
    Guid Id,
    string MaskedPan,
    string Alias,
    decimal CreditLimit,
    decimal AvailableBalance,
    string Currency)
{
    /// <summary>Deuda pendiente: lo que se ha consumido del límite.</summary>
    public decimal OutstandingBalance => CreditLimit - AvailableBalance;

    public bool CanAcceptPayment(decimal amount) => amount > 0 && amount <= OutstandingBalance;
}

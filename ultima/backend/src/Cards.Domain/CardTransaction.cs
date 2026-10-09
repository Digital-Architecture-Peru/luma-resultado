namespace Cards.Domain;

public static class TransactionTypes
{
    public const string Payment = "PAYMENT";
}

public static class TransactionStatuses
{
    public const string Approved = "APPROVED";
    public const string Declined = "DECLINED";
}

public sealed record CardTransaction(
    Guid Id,
    Guid CardId,
    string Type,
    decimal Amount,
    string Currency,
    string Status,
    string IdempotencyKey,
    DateTime CreatedAt)
{
    public static CardTransaction NewApprovedPayment(
        Guid cardId, decimal amount, string currency, string idempotencyKey, DateTime nowUtc) =>
        new(Guid.NewGuid(), cardId, TransactionTypes.Payment, amount, currency,
            TransactionStatuses.Approved, idempotencyKey, nowUtc);
}

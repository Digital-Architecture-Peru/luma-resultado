using Cards.Domain;

namespace Cards.Api;

public sealed record CreatePaymentRequest(Guid CardId, decimal Amount, string? Currency);

public sealed record TransactionResponse(
    Guid Id,
    Guid CardId,
    decimal Amount,
    string Currency,
    string Status,
    DateTimeOffset CreatedAt,
    string? RejectionReason)
{
    public static TransactionResponse From(CardTransaction t) => new(
        t.Id,
        t.CardId,
        t.Amount.Amount,
        t.Amount.Currency,
        t.Status.ToString().ToUpperInvariant(),
        t.CreatedAt,
        t.RejectionReason);
}

using Cards.Domain;

namespace Cards.Application;

public sealed record PaymentRequest(decimal Amount, string? Currency, string? SourceAccountAlias);

public sealed record PayCardCommand(Guid CardId, string? IdempotencyKey, PaymentRequest Request);

public sealed record PaymentOutcome(CardTransaction Transaction, bool Replayed);

public sealed record CardDto(
    Guid Id, string MaskedPan, string Alias, decimal CreditLimit,
    decimal AvailableBalance, decimal OutstandingBalance, string Currency);

public sealed record TransactionDto(
    Guid Id, Guid CardId, string Type, decimal Amount, string Currency, string Status, DateTime CreatedAt);

public static class DtoMapper
{
    public static CardDto ToDto(this Card c) =>
        new(c.Id, c.MaskedPan, c.Alias, c.CreditLimit, c.AvailableBalance, c.OutstandingBalance, c.Currency);

    public static TransactionDto ToDto(this CardTransaction t) =>
        new(t.Id, t.CardId, t.Type, t.Amount, t.Currency, t.Status, t.CreatedAt);
}

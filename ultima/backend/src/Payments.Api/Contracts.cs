using Payments.Domain;

namespace Payments.Api;

public sealed record CreatePaymentRequest(
    Guid SourceAccountId, string? BeneficiaryAccount, decimal Amount, string? Currency, string? Reference)
{
    public PaymentRequest ToDomain() =>
        new(SourceAccountId, BeneficiaryAccount ?? "", Amount, Currency ?? "", Reference ?? "");
}

public sealed record PaymentResponse(
    Guid Id, string Status, decimal Amount, string Currency, string BeneficiaryAccount, string Reference,
    DateTimeOffset CreatedAt)
{
    public static PaymentResponse From(Payment p) =>
        new(p.Id, p.Status.ToString().ToUpperInvariant(), p.Amount, p.Currency, p.BeneficiaryAccount, p.Reference, p.CreatedAt);
}

public sealed record AccountResponse(Guid Id, string Number, string Holder, string Currency, decimal Balance)
{
    public static AccountResponse From(Account a) => new(a.Id, a.Number, a.Holder, a.Currency, a.Balance);
}

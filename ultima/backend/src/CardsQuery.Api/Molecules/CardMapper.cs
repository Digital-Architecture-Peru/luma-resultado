using CardsQuery.Api.Atoms;
using CardsQuery.Api.Domain;

namespace CardsQuery.Api.Molecules;

/// <summary>Molécula: compone átomos (máscara, dinero) para producir DTOs sin exponer el número completo.</summary>
public static class CardMapper
{
    public const int ExpiringSoonDays = 60;

    public static CardSummaryDto ToSummary(Card card) => new(
        card.Id,
        CardNumberMask.Mask(card.Number),
        card.Type.ToString(),
        card.Status.ToString(),
        Money.Of(card.AvailableBalance, card.Currency),
        FormatExpiry(card.ExpiryDate));

    public static CardDetailDto ToDetail(Card card, DateOnly today) => new(
        card.Id,
        card.HolderName,
        CardNumberMask.Mask(card.Number),
        card.Type.ToString(),
        card.Status.ToString(),
        Money.Of(card.CreditLimit, card.Currency),
        Money.Of(card.AvailableBalance, card.Currency),
        FormatExpiry(card.ExpiryDate),
        IsExpiringSoon(card.ExpiryDate, today));

    private static bool IsExpiringSoon(DateOnly expiry, DateOnly today) =>
        expiry >= today && expiry <= today.AddDays(ExpiringSoonDays);

    private static string FormatExpiry(DateOnly expiry) => expiry.ToString("MM/yy");
}

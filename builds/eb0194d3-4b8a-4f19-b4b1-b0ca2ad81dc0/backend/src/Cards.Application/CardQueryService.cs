using System.Text.RegularExpressions;
using Cards.Domain;

namespace Cards.Application;

public interface ICardQueryService
{
    Task<IReadOnlyList<CardSummary>> GetCustomerCardsAsync(string customerId, CancellationToken cancellationToken = default);

    Task<CardDetail?> GetCardDetailAsync(Guid cardId, CancellationToken cancellationToken = default);
}

public sealed partial class CardQueryService : ICardQueryService
{
    private const int MaxCustomerIdLength = 36;

    private readonly ICardRepository _repository;

    public CardQueryService(ICardRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CardSummary>> GetCustomerCardsAsync(
        string customerId, CancellationToken cancellationToken = default)
    {
        ValidateCustomerId(customerId);
        var cards = await _repository.ListByCustomerAsync(customerId, cancellationToken);
        return cards.Select(ToSummary).ToList();
    }

    public async Task<CardDetail?> GetCardDetailAsync(Guid cardId, CancellationToken cancellationToken = default)
    {
        var card = await _repository.FindByIdAsync(cardId, cancellationToken);
        return card is null ? null : ToDetail(card);
    }

    private static void ValidateCustomerId(string? customerId)
    {
        if (string.IsNullOrWhiteSpace(customerId)
            || customerId.Length > MaxCustomerIdLength
            || !CustomerIdPattern().IsMatch(customerId))
        {
            throw new ArgumentException(
                "customerId es obligatorio, alfanumérico (con guiones) y de máximo 36 caracteres.",
                nameof(customerId));
        }
    }

    private static string StatusCode(CardStatus status) => status.ToString().ToUpperInvariant();

    private static CardSummary ToSummary(Card card) => new(
        card.Id, card.ProductName, card.Brand, card.MaskedPan,
        StatusCode(card.Status), card.Currency, card.AvailableBalance);

    private static CardDetail ToDetail(Card card) => new(
        card.Id, card.ProductName, card.Brand, card.MaskedPan,
        StatusCode(card.Status), card.Currency, card.AvailableBalance,
        card.CreditLimit, card.Expiry);

    [GeneratedRegex("^[A-Za-z0-9-]+$")]
    private static partial Regex CustomerIdPattern();
}

namespace Cards.Application;

public sealed class CardNotFoundException : Exception
{
    public CardNotFoundException(Guid cardId)
        : base("La tarjeta solicitada no existe.")
    {
        CardId = cardId;
    }

    public Guid CardId { get; }
}

public sealed class CardQueryService
{
    private readonly ICardRepository _repository;

    public CardQueryService(ICardRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CardDto>> GetCardsAsync(Guid customerId, CancellationToken ct = default)
    {
        var cards = await _repository.ListByCustomerAsync(customerId, ct);
        return cards.Select(ToDto).ToList();
    }

    public async Task<CardDto> GetCardAsync(Guid customerId, Guid cardId, CancellationToken ct = default)
    {
        var card = await _repository.FindByIdAsync(cardId, ct);

        // Una tarjeta ajena responde igual que una inexistente para no revelar su existencia.
        if (card is null || card.CustomerId != customerId)
        {
            throw new CardNotFoundException(cardId);
        }

        return ToDto(card);
    }

    private static CardDto ToDto(Card card) => new(
        card.Id,
        CardMasking.Mask(card.PanLast4),
        card.Brand,
        card.CardType,
        card.Status,
        card.CreditLimit,
        card.AvailableBalance,
        card.Currency,
        CardMasking.FormatExpiry(card.ExpiryMonth, card.ExpiryYear));
}

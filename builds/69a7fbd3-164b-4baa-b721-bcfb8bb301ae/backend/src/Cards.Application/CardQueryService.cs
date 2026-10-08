using Cards.Domain;

namespace Cards.Application;

public sealed class CardQueryService(ICardQueryRepository repository)
{
    public const int MaxPageSize = 100;

    public async Task<IReadOnlyList<CardDto>> ListAsync(Guid customerId, CancellationToken ct)
    {
        var cards = await repository.ListByCustomerAsync(customerId, ct);
        return cards.Select(ToDto).ToList();
    }

    public async Task<CardDto?> GetAsync(Guid customerId, Guid cardId, CancellationToken ct)
    {
        var card = await repository.FindAsync(customerId, cardId, ct);
        return card is null ? null : ToDto(card);
    }

    /// <summary>Devuelve null si la tarjeta no existe o no pertenece al cliente.</summary>
    public async Task<PagedResult<MovementDto>?> GetMovementsAsync(
        Guid customerId, Guid cardId, int page, int size, CancellationToken ct)
    {
        if (page < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(page), "page debe ser mayor o igual a 1.");
        }

        if (size < 1 || size > MaxPageSize)
        {
            throw new ArgumentOutOfRangeException(nameof(size), $"size debe estar entre 1 y {MaxPageSize}.");
        }

        var card = await repository.FindAsync(customerId, cardId, ct);
        if (card is null)
        {
            return null;
        }

        var (items, total) = await repository.ListMovementsAsync(cardId, (page - 1) * size, size, ct);
        var dtos = items.Select(m => new MovementDto(m.Id, m.PostedAt, m.Description, m.Amount, m.Currency)).ToList();
        return new PagedResult<MovementDto>(dtos, page, size, total);
    }

    private static CardDto ToDto(Card card) => new(
        card.Id,
        PanMasking.Mask(card.Last4),
        card.Brand,
        card.Product,
        card.Status.ToString(),
        card.CreditLimit,
        card.Available,
        card.Currency,
        $"{card.ExpiryMonth:00}/{card.ExpiryYear % 100:00}");
}

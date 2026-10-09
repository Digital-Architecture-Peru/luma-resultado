namespace Cards.Application;

/// <summary>Consultas de tarjetas y movimientos.</summary>
public sealed class CardQueries(ICardTransactionRepository repository)
{
    public const int PageSize = 20;

    public async Task<IReadOnlyList<CardDto>> ListCardsAsync(CancellationToken ct)
    {
        var cards = await repository.ListCardsAsync(ct);
        return cards.Select(c => c.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<TransactionDto>> ListTransactionsAsync(Guid cardId, int page, CancellationToken ct)
    {
        if (page < 1)
            throw RequestValidationException.For("page", "La página debe ser mayor o igual a 1.");

        _ = await repository.FindCardAsync(cardId, ct) ?? throw new NotFoundException("Tarjeta no encontrada.");

        var items = await repository.ListTransactionsAsync(cardId, (page - 1) * PageSize, PageSize, ct);
        return items.Select(t => t.ToDto()).ToList();
    }
}

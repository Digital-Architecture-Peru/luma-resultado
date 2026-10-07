using CardsQuery.Api.Domain;
using CardsQuery.Api.Molecules;

namespace CardsQuery.Api.Organisms;

public interface ICardQueryService
{
    PagedResult<CardSummaryDto> List(string customerId, string? status, int page, int pageSize);
    CardDetailDto Get(string customerId, string cardId);
}

/// <summary>Organismo: caso de uso de consulta de tarjetas (filtrado, paginación y detalle).</summary>
public sealed class CardQueryService(ICardReader reader, TimeProvider clock) : ICardQueryService
{
    public const int MaxPageSize = 50;

    public PagedResult<CardSummaryDto> List(string customerId, string? status, int page, int pageSize)
    {
        RequireCustomer(customerId);
        if (page < 1) throw new InvalidQueryException("page debe ser >= 1.");
        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new InvalidQueryException($"pageSize debe estar entre 1 y {MaxPageSize}.");

        var filter = ParseStatus(status);
        var cards = reader.FindByCustomer(customerId)
            .Where(c => filter is null || c.Status == filter)
            .OrderBy(c => c.Id, StringComparer.Ordinal)
            .ToList();

        var items = cards.Skip((page - 1) * pageSize).Take(pageSize).Select(CardMapper.ToSummary).ToList();
        return new PagedResult<CardSummaryDto>(items, page, pageSize, cards.Count);
    }

    public CardDetailDto Get(string customerId, string cardId)
    {
        RequireCustomer(customerId);
        var card = reader.FindByCustomer(customerId).FirstOrDefault(c => c.Id == cardId)
                   ?? throw new CardNotFoundException(cardId);
        return CardMapper.ToDetail(card, DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime));
    }

    private static void RequireCustomer(string customerId)
    {
        if (string.IsNullOrWhiteSpace(customerId))
            throw new InvalidQueryException("customerId es obligatorio.");
    }

    private static CardStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return null;
        if (Enum.TryParse<CardStatus>(status, ignoreCase: true, out var parsed) && Enum.IsDefined(parsed))
            return parsed;
        throw new InvalidQueryException($"status inválido: '{status}'. Valores: Active, Blocked, Expired.");
    }
}

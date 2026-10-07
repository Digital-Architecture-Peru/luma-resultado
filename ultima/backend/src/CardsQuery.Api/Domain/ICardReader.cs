namespace CardsQuery.Api.Domain;

/// <summary>Puerto de lectura de tarjetas; la integración real (sin definir) se implementa como adaptador.</summary>
public interface ICardReader
{
    IReadOnlyList<Card> FindByCustomer(string customerId);
}

public sealed class CardNotFoundException(string cardId)
    : Exception($"Tarjeta '{cardId}' no encontrada.");

public sealed class InvalidQueryException(string message) : Exception(message);

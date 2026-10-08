namespace Cards.Domain;

public sealed record CardMovement(
    Guid Id,
    Guid CardId,
    DateTimeOffset PostedAt,
    string Description,
    decimal Amount,
    string Currency);

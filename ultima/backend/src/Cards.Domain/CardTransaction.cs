namespace Cards.Domain;

public enum TransactionStatus
{
    Pending,
    Approved,
    Rejected
}

/// <summary>Pago de tarjeta. Transiciones válidas: Pending → Approved | Rejected.</summary>
public sealed class CardTransaction
{
    private CardTransaction(
        Guid id,
        Guid cardId,
        Money amount,
        TransactionStatus status,
        string idempotencyKey,
        DateTimeOffset createdAt,
        string? rejectionReason)
    {
        Id = id;
        CardId = cardId;
        Amount = amount;
        Status = status;
        IdempotencyKey = idempotencyKey;
        CreatedAt = createdAt;
        RejectionReason = rejectionReason;
    }

    public Guid Id { get; }
    public Guid CardId { get; }
    public Money Amount { get; }
    public TransactionStatus Status { get; private set; }
    public string IdempotencyKey { get; }
    public DateTimeOffset CreatedAt { get; }
    public string? RejectionReason { get; private set; }

    public static CardTransaction Create(Guid cardId, Money amount, string idempotencyKey, DateTimeOffset now)
    {
        if (cardId == Guid.Empty)
        {
            throw new DomainException("La tarjeta es obligatoria.");
        }

        return new CardTransaction(Guid.NewGuid(), cardId, amount, TransactionStatus.Pending, idempotencyKey, now, null);
    }

    /// <summary>Reconstruye una transacción persistida sin revalidar transiciones.</summary>
    public static CardTransaction Restore(
        Guid id,
        Guid cardId,
        Money amount,
        TransactionStatus status,
        string idempotencyKey,
        DateTimeOffset createdAt,
        string? rejectionReason) =>
        new(id, cardId, amount, status, idempotencyKey, createdAt, rejectionReason);

    public void Approve()
    {
        EnsurePending();
        Status = TransactionStatus.Approved;
    }

    public void Reject(string reason)
    {
        EnsurePending();
        if (string.IsNullOrWhiteSpace(reason))
        {
            throw new DomainException("El motivo de rechazo es obligatorio.");
        }

        Status = TransactionStatus.Rejected;
        RejectionReason = reason;
    }

    private void EnsurePending()
    {
        if (Status != TransactionStatus.Pending)
        {
            throw new DomainException($"La transacción ya está en estado {Status}.");
        }
    }
}

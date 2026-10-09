using Cards.Domain;

namespace Cards.Application;

public sealed record RegisterPaymentCommand(Guid CardId, decimal Amount, string? Currency, string? IdempotencyKey);

public sealed record PaymentOutcome(CardTransaction Transaction, bool Replayed);

/// <summary>Caso de uso: pago de tarjeta de crédito (hipótesis H1 del diseño).</summary>
public sealed class RegisterPaymentUseCase
{
    private const int MinKeyLength = 8;
    private const int MaxKeyLength = 64;

    private readonly ICardTransactionRepository _repository;
    private readonly ICardTransactionGateway _gateway;
    private readonly PaymentLimits _limits;
    private readonly TimeProvider _clock;

    public RegisterPaymentUseCase(
        ICardTransactionRepository repository,
        ICardTransactionGateway gateway,
        PaymentLimits limits,
        TimeProvider clock)
    {
        _repository = repository;
        _gateway = gateway;
        _limits = limits;
        _clock = clock;
    }

    public async Task<PaymentOutcome> ExecuteAsync(RegisterPaymentCommand command, CancellationToken ct)
    {
        var key = command.IdempotencyKey?.Trim();
        if (string.IsNullOrEmpty(key) || key.Length < MinKeyLength || key.Length > MaxKeyLength)
        {
            throw new DomainException($"Idempotency-Key debe tener entre {MinKeyLength} y {MaxKeyLength} caracteres.");
        }

        var existing = await _repository.FindByIdempotencyKeyAsync(key, ct);
        if (existing is not null)
        {
            return new PaymentOutcome(existing, true);
        }

        var money = Money.Create(command.Amount, command.Currency);
        if (!await _repository.CardIsActiveAsync(command.CardId, ct))
        {
            throw new CardNotFoundException(command.CardId);
        }

        var transaction = CardTransaction.Create(command.CardId, money, key, _clock.GetUtcNow());
        await DecideAsync(transaction, ct);

        if (await _repository.TryAddAsync(transaction, ct))
        {
            return new PaymentOutcome(transaction, false);
        }

        // Carrera: otra petición con la misma clave insertó primero.
        var winner = await _repository.FindByIdempotencyKeyAsync(key, ct)
            ?? throw new InvalidOperationException("Conflicto de idempotencia sin transacción existente.");
        return new PaymentOutcome(winner, true);
    }

    private async Task DecideAsync(CardTransaction transaction, CancellationToken ct)
    {
        if (transaction.Amount.Amount > _limits.MaxAmount)
        {
            transaction.Reject("El importe supera el límite permitido.");
            return;
        }

        var result = await _gateway.AuthorizeAsync(transaction, ct);
        if (result.Approved)
        {
            transaction.Approve();
        }
        else
        {
            transaction.Reject(result.Reason ?? "Rechazado por el autorizador.");
        }
    }
}

public sealed class ListTransactionsUseCase
{
    private const int DefaultLimit = 20;
    private const int MaxLimit = 100;

    private readonly ICardTransactionRepository _repository;

    public ListTransactionsUseCase(ICardTransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CardTransaction>> ExecuteAsync(Guid cardId, int? limit, CancellationToken ct)
    {
        var effective = Math.Clamp(limit ?? DefaultLimit, 1, MaxLimit);
        if (!await _repository.CardIsActiveAsync(cardId, ct))
        {
            throw new CardNotFoundException(cardId);
        }

        return await _repository.ListByCardAsync(cardId, effective, ct);
    }
}

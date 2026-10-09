using Cards.Domain;
using Microsoft.Extensions.Logging;

namespace Cards.Application;

/// <summary>Caso de uso: pago de tarjeta con idempotencia.</summary>
public sealed class PayCardHandler(
    ICardTransactionRepository repository,
    ICardProcessorGateway gateway,
    TimeProvider clock,
    ILogger<PayCardHandler> logger)
{
    private const int MaxKeyLength = 64;
    private const int MaxAliasLength = 40;

    public async Task<PaymentOutcome> HandleAsync(PayCardCommand command, CancellationToken ct)
    {
        var errors = Validate(command);
        if (errors.Count > 0)
            throw new RequestValidationException(errors);

        var key = command.IdempotencyKey!.Trim();
        var amount = command.Request.Amount;
        var currency = command.Request.Currency!.Trim().ToUpperInvariant();

        var existing = await repository.FindByIdempotencyKeyAsync(key, ct);
        if (existing is not null)
            return Replay(existing, command.CardId, amount, currency);

        var card = await repository.FindCardAsync(command.CardId, ct)
                   ?? throw new NotFoundException("Tarjeta no encontrada.");

        if (!string.Equals(card.Currency, currency, StringComparison.Ordinal))
            throw RequestValidationException.For("currency", "La moneda no coincide con la de la tarjeta.");
        if (!card.CanAcceptPayment(amount))
            throw RequestValidationException.For("amount", "El monto excede la deuda pendiente de la tarjeta.");

        var decision = await gateway.AuthorizePaymentAsync(card.Id, amount, currency, ct);
        if (!decision.Approved)
        {
            logger.LogWarning("Pago rechazado por el procesador para la tarjeta {Card}", card.MaskedPan);
            throw new PaymentDeclinedException("El procesador rechazó el pago.");
        }

        var payment = CardTransaction.NewApprovedPayment(card.Id, amount, currency, key, clock.GetUtcNow().UtcDateTime);
        var result = await repository.ApplyPaymentAsync(payment, ct);

        switch (result)
        {
            case ApplyPaymentResult.Applied:
                logger.LogInformation("Pago aplicado a la tarjeta {Card}", card.MaskedPan);
                return new PaymentOutcome(payment, Replayed: false);
            case ApplyPaymentResult.DuplicateKey:
                var winner = await repository.FindByIdempotencyKeyAsync(key, ct)
                             ?? throw new ConflictException("Clave de idempotencia en uso.");
                return Replay(winner, command.CardId, amount, currency);
            default:
                throw RequestValidationException.For("amount", "El monto excede la deuda pendiente de la tarjeta.");
        }
    }

    private static PaymentOutcome Replay(CardTransaction existing, Guid cardId, decimal amount, string currency)
    {
        var samePayload = existing.CardId == cardId && existing.Amount == amount && existing.Currency == currency;
        if (!samePayload)
            throw new ConflictException("La clave de idempotencia ya se usó con una solicitud distinta.");
        return new PaymentOutcome(existing, Replayed: true);
    }

    private static Dictionary<string, string[]> Validate(PayCardCommand command)
    {
        var errors = new Dictionary<string, string[]>();
        var key = command.IdempotencyKey?.Trim();
        if (string.IsNullOrEmpty(key) || key.Length > MaxKeyLength)
            errors["Idempotency-Key"] = [$"La cabecera es obligatoria (máximo {MaxKeyLength} caracteres)."];

        var request = command.Request;
        if (request.Amount <= 0 || decimal.Round(request.Amount, 2) != request.Amount)
            errors["amount"] = ["El monto debe ser mayor a 0 y tener máximo 2 decimales."];

        var currency = request.Currency?.Trim();
        if (currency is null || currency.Length != 3 || !currency.All(char.IsLetter))
            errors["currency"] = ["La moneda debe ser un código ISO de 3 letras."];

        var alias = request.SourceAccountAlias?.Trim();
        if (string.IsNullOrEmpty(alias) || alias.Length > MaxAliasLength)
            errors["sourceAccountAlias"] = [$"El alias de la cuenta es obligatorio (máximo {MaxAliasLength} caracteres)."];

        return errors;
    }
}

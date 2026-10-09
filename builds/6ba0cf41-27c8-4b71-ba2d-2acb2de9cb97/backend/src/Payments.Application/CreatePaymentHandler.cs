using Payments.Domain;

namespace Payments.Application;

/// <summary>Caso de uso: registrar y procesar un pago de forma idempotente.</summary>
public sealed class CreatePaymentHandler
{
    private readonly IPaymentRepository _repository;
    private readonly IPaymentProcessor _processor;
    private readonly PaymentPolicy _policy;
    private readonly TimeProvider _clock;

    public CreatePaymentHandler(
        IPaymentRepository repository,
        IPaymentProcessor processor,
        PaymentPolicy policy,
        TimeProvider clock)
    {
        _repository = repository;
        _processor = processor;
        _policy = policy;
        _clock = clock;
    }

    public async Task<PaymentResponse> HandleAsync(
        string customerId,
        string idempotencyKey,
        CreatePaymentRequest request,
        CancellationToken ct)
    {
        ValidateKey(idempotencyKey);
        var errors = PaymentRequestValidator.Validate(request, _policy);
        if (errors.Count > 0)
            throw new RequestValidationException(errors);

        if (await _repository.FindByIdempotencyKeyAsync(idempotencyKey, ct) is not null)
            throw new DuplicateIdempotencyKeyException(idempotencyKey);

        var payment = Payment.Create(
            customerId, request.SourceAccountId, request.BeneficiaryAccount,
            request.Amount, request.Currency, request.Concept ?? "", idempotencyKey,
            _clock.GetUtcNow());
        await _repository.AddAsync(payment, ct);

        var result = await _processor.ProcessAsync(payment, ct);
        if (result.Approved)
            payment.Complete(_clock.GetUtcNow());
        else
            payment.Reject(result.Reason ?? "Rechazado por el procesador.", _clock.GetUtcNow());

        await _repository.UpdateAsync(payment, ct);
        return PaymentResponse.From(payment);
    }

    private static void ValidateKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key) || key.Length > 64)
            throw new RequestValidationException(new Dictionary<string, string[]>
            {
                ["Idempotency-Key"] = new[] { "La cabecera Idempotency-Key es obligatoria (máx. 64 caracteres)." }
            });
    }
}

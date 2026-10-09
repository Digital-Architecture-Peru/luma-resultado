using Payments.Domain;

namespace Payments.Application;

public sealed class PaymentOptions
{
    /// <summary>Límite por transacción (valor ficticio configurable).</summary>
    public decimal MaxAmount { get; init; } = 5000m;
}

public sealed class PaymentService
{
    private const int MaxKeyLength = 64;

    private readonly IPaymentRepository _repository;
    private readonly IPaymentGateway _gateway;
    private readonly PaymentOptions _options;
    private readonly TimeProvider _clock;

    public PaymentService(
        IPaymentRepository repository, IPaymentGateway gateway, PaymentOptions options, TimeProvider clock)
    {
        _repository = repository;
        _gateway = gateway;
        _options = options;
        _clock = clock;
    }

    public Task<IReadOnlyList<Account>> ListAccountsAsync(CancellationToken ct) =>
        _repository.ListAccountsAsync(ct);

    public Task<Payment?> GetPaymentAsync(Guid id, CancellationToken ct) =>
        _repository.FindPaymentAsync(id, ct);

    public async Task<Payment> CreateAsync(PaymentRequest request, string? idempotencyKey, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(request);
        var key = ValidateKey(idempotencyKey);

        var existing = await _repository.FindByIdempotencyKeyAsync(key, ct);
        if (existing is not null)
            return existing.Matches(request) ? existing : throw new IdempotencyConflictException(key);

        var source = await _repository.FindAccountAsync(request.SourceAccountId, ct)
            ?? throw new DomainException("La cuenta origen no existe.");

        var payment = Payment.Create(source, request, key, _options.MaxAmount, _clock.GetUtcNow());
        if (await _gateway.AuthorizeAsync(payment, ct)) payment.Complete();
        else payment.Reject();

        await _repository.SaveAsync(payment, ct);
        return payment;
    }

    private static string ValidateKey(string? key)
    {
        if (string.IsNullOrWhiteSpace(key) || key.Length > MaxKeyLength)
            throw new DomainException($"Se requiere el encabezado Idempotency-Key (máximo {MaxKeyLength} caracteres).");
        return key;
    }
}

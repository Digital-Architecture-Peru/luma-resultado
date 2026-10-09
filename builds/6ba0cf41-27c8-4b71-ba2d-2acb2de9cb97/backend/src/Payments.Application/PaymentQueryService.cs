namespace Payments.Application;

/// <summary>Consultas de pagos acotadas al cliente autenticado.</summary>
public sealed class PaymentQueryService
{
    private readonly IPaymentRepository _repository;

    public PaymentQueryService(IPaymentRepository repository) => _repository = repository;

    public async Task<PaymentResponse?> GetAsync(string customerId, Guid id, CancellationToken ct)
    {
        var payment = await _repository.GetByIdAsync(id, customerId, ct);
        return payment is null ? null : PaymentResponse.From(payment);
    }

    public async Task<IReadOnlyList<PaymentResponse>> ListAsync(string customerId, string accountId, CancellationToken ct)
    {
        var payments = await _repository.ListByAccountAsync(customerId, accountId, ct);
        return payments.Select(PaymentResponse.From).ToList();
    }
}

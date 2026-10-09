namespace Payments.Domain;

public sealed record PaymentFilter(
    DateTimeOffset? From,
    DateTimeOffset? To,
    PaymentStatus? Status,
    int Page,
    int PageSize);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);

/// <summary>Puerto de lectura. Toda consulta está acotada al cliente indicado.</summary>
public interface IPaymentQueryRepository
{
    Task<PagedResult<Payment>> SearchAsync(Guid customerId, PaymentFilter filter, CancellationToken ct);

    Task<Payment?> FindByIdAsync(Guid customerId, Guid id, CancellationToken ct);
}

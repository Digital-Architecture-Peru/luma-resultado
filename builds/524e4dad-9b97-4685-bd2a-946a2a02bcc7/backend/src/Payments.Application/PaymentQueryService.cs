using Payments.Domain;

namespace Payments.Application;

public sealed class QueryValidationException : Exception
{
    public QueryValidationException(string message) : base(message) { }
}

public sealed class PaymentQueryService
{
    public const int MaxPageSize = 100;

    private readonly IPaymentQueryRepository _repository;

    public PaymentQueryService(IPaymentQueryRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<PaymentDto>> SearchAsync(
        Guid customerId,
        DateTimeOffset? from,
        DateTimeOffset? to,
        string? status,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        if (page < 1) throw new QueryValidationException("page debe ser mayor o igual a 1.");
        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new QueryValidationException($"pageSize debe estar entre 1 y {MaxPageSize}.");
        if (from.HasValue && to.HasValue && from > to)
            throw new QueryValidationException("from no puede ser posterior a to.");

        var filter = new PaymentFilter(from, to, ParseStatus(status), page, pageSize);
        var result = await _repository.SearchAsync(customerId, filter, ct);
        var items = result.Items.Select(PaymentDto.From).ToList();
        return new PagedResult<PaymentDto>(items, result.Page, result.PageSize, result.Total);
    }

    public async Task<PaymentDto?> GetAsync(Guid customerId, Guid id, CancellationToken ct)
    {
        var payment = await _repository.FindByIdAsync(customerId, id, ct);
        return payment is null ? null : PaymentDto.From(payment);
    }

    private static PaymentStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return null;
        if (Enum.TryParse<PaymentStatus>(status, ignoreCase: true, out var parsed)
            && Enum.IsDefined(parsed))
            return parsed;
        throw new QueryValidationException("status no es válido (PENDING, COMPLETED, REJECTED).");
    }
}

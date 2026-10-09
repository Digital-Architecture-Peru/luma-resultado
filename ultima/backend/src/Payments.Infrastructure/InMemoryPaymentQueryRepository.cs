using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>Repositorio en memoria con datos ficticios (espejo de V002__seed_fake.sql).</summary>
public sealed class InMemoryPaymentQueryRepository : IPaymentQueryRepository
{
    public static readonly Guid DemoCustomerId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid OtherCustomerId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    private readonly IReadOnlyList<Payment> _payments;

    public InMemoryPaymentQueryRepository() : this(SeedData()) { }

    public InMemoryPaymentQueryRepository(IEnumerable<Payment> payments)
    {
        _payments = payments.ToList();
    }

    public Task<PagedResult<Payment>> SearchAsync(Guid customerId, PaymentFilter filter, CancellationToken ct)
    {
        var query = _payments.Where(p => p.CustomerId == customerId);
        if (filter.From.HasValue) query = query.Where(p => p.PaidAt >= filter.From.Value);
        if (filter.To.HasValue) query = query.Where(p => p.PaidAt <= filter.To.Value);
        if (filter.Status.HasValue) query = query.Where(p => p.Status == filter.Status.Value);

        var ordered = query.OrderByDescending(p => p.PaidAt).ThenBy(p => p.Id).ToList();
        var items = ordered
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToList();
        return Task.FromResult(new PagedResult<Payment>(items, filter.Page, filter.PageSize, ordered.Count));
    }

    public Task<Payment?> FindByIdAsync(Guid customerId, Guid id, CancellationToken ct)
    {
        var found = _payments.FirstOrDefault(p => p.CustomerId == customerId && p.Id == id);
        return Task.FromResult(found);
    }

    public static IReadOnlyList<Payment> SeedData()
    {
        var baseDate = new DateTimeOffset(2026, 9, 1, 10, 0, 0, TimeSpan.Zero);
        var beneficiaries = new[]
        {
            "Servicios Aurora S.A.", "Agua Cristalina", "Luz del Norte", "Telecom Demo",
            "Colegio Horizonte", "Seguros Faro", "Club Deportivo Sur", "Gas Ficticio"
        };
        var statuses = new[] { PaymentStatus.Completed, PaymentStatus.Pending, PaymentStatus.Rejected };

        var list = new List<Payment>();
        for (var i = 0; i < beneficiaries.Length; i++)
        {
            list.Add(new Payment(
                Guid.Parse($"00000000-0000-0000-0000-0000000001{i:00}"),
                DemoCustomerId,
                beneficiaries[i],
                $"****{1000 + i * 111}",
                100m + i * 250.5m,
                "USD",
                statuses[i % statuses.Length],
                baseDate.AddDays(i * 3),
                $"REF-{2026000 + i}"));
        }

        list.Add(new Payment(
            Guid.Parse("00000000-0000-0000-0000-000000000201"),
            OtherCustomerId, "Beneficiario Ajeno", "****9999", 999m, "USD",
            PaymentStatus.Completed, baseDate, "REF-OTHER-1"));
        return list;
    }
}

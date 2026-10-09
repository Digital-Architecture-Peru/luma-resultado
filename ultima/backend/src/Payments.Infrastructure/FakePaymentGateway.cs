using Payments.Application;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>
/// Gateway determinista sin llamadas externas: rechaza cuentas beneficiarias terminadas en "0000".
/// Sustituir por el adaptador real cuando se defina la integración.
/// </summary>
public sealed class FakePaymentGateway : IPaymentGateway
{
    public Task<bool> AuthorizeAsync(Payment payment, CancellationToken ct) =>
        Task.FromResult(!payment.BeneficiaryAccount.EndsWith("0000", StringComparison.Ordinal));
}

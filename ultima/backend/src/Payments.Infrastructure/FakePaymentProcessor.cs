using Payments.Application;
using Payments.Domain;

namespace Payments.Infrastructure;

/// <summary>
/// Procesador ficticio (integración sin definir). Rechaza cuentas destino terminadas en "0000"
/// para poder ejercitar el flujo de rechazo. No realiza llamadas externas.
/// </summary>
public sealed class FakePaymentProcessor : IPaymentProcessor
{
    public Task<ProcessResult> ProcessAsync(Payment payment, CancellationToken ct)
    {
        var result = payment.BeneficiaryAccount.EndsWith("0000", StringComparison.Ordinal)
            ? new ProcessResult(false, "Cuenta destino no habilitada para recibir pagos.")
            : new ProcessResult(true, null);
        return Task.FromResult(result);
    }
}

using Cards.Application;
using Cards.Domain;

namespace Cards.Infrastructure;

/// <summary>
/// Adaptador ficticio del core (integración sin definir). No realiza llamadas externas.
/// Regla de demostración: rechaza importes con céntimos .99 para poder probar el rechazo.
/// </summary>
public sealed class FakeCoreGateway : ICardTransactionGateway
{
    public Task<GatewayResult> AuthorizeAsync(CardTransaction transaction, CancellationToken ct)
    {
        var declined = transaction.Amount.Amount % 1m == 0.99m;
        var result = declined
            ? new GatewayResult(false, "Fondos insuficientes (simulado).")
            : new GatewayResult(true, null);
        return Task.FromResult(result);
    }
}

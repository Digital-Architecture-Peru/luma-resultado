using Cards.Application;

namespace Cards.Infrastructure;

/// <summary>
/// Procesador ficticio: aprueba pagos hasta un tope. Reemplazar cuando se defina la integración real.
/// </summary>
public sealed class FakeCardProcessorGateway : ICardProcessorGateway
{
    public const decimal MaxApprovedAmount = 100_000m;

    public Task<GatewayDecision> AuthorizePaymentAsync(Guid cardId, decimal amount, string currency, CancellationToken ct)
    {
        var approved = amount > 0 && amount <= MaxApprovedAmount;
        return Task.FromResult(new GatewayDecision(approved, $"FAKE-{Guid.NewGuid():N}"));
    }
}

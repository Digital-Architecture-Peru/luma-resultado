using Pagos.Application;

namespace Pagos.Api;

/// <summary>
/// Sustituto del cliente autenticado (H2): en producción el gateway/BFF del canal entrega la identidad.
/// Las cuentas vienen de PAGOS_STUB_CUENTAS (separadas por coma); por defecto las del seed ficticio.
/// </summary>
public sealed class StubCurrentCustomer : ICurrentCustomer
{
    private const string CuentasPorDefecto = "0012345678,0098765432";

    public StubCurrentCustomer()
    {
        var texto = Environment.GetEnvironmentVariable("PAGOS_STUB_CUENTAS") ?? CuentasPorDefecto;
        CuentaIds = texto.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    public IReadOnlyList<string> CuentaIds { get; }
}

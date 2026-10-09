using Pagos.Domain;

namespace Pagos.Application;

public sealed record PagoDto(
    Guid Id,
    string CuentaEnmascarada,
    string Referencia,
    string Beneficiario,
    decimal Monto,
    string Moneda,
    string Estado,
    DateTimeOffset FechaPago,
    string Canal)
{
    public static PagoDto Desde(Pago pago) => new(
        pago.Id,
        EnmascararCuenta(pago.CuentaId),
        pago.Referencia,
        pago.Beneficiario,
        pago.Monto,
        pago.Moneda,
        pago.Estado.ToCodigo(),
        pago.FechaPago,
        pago.Canal);

    /// <summary>Muestra solo los últimos 4 caracteres de la cuenta.</summary>
    public static string EnmascararCuenta(string cuentaId)
    {
        const int visibles = 4;
        if (string.IsNullOrEmpty(cuentaId)) return string.Empty;
        return cuentaId.Length <= visibles
            ? new string('*', cuentaId.Length)
            : "****" + cuentaId[^visibles..];
    }
}

public sealed record ResultadoPaginado<T>(IReadOnlyList<T> Items, int Page, int Size, int Total);

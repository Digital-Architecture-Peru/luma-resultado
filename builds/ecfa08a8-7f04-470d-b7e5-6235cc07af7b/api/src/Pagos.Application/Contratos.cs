using Pagos.Domain;

namespace Pagos.Application;

public sealed record ConsultaPagosFiltro(
    Guid ClienteId,
    DateTimeOffset Desde,
    DateTimeOffset Hasta,
    EstadoPago? Estado,
    int Page,
    int PageSize);

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int Total);

public sealed record PagoDto(
    Guid Id,
    string Referencia,
    string Beneficiario,
    string CuentaDestino,
    decimal Monto,
    string Moneda,
    string Estado,
    DateTimeOffset FechaPago)
{
    public static PagoDto Desde(Pago pago) => new(
        pago.Id,
        pago.Referencia,
        pago.Beneficiario,
        CuentaMask.Enmascarar(pago.CuentaDestinoMask),
        pago.Monto,
        pago.Moneda,
        pago.Estado.ToString().ToUpperInvariant(),
        pago.FechaPago.ToUniversalTime());
}

/// <summary>Puerto de persistencia. Toda consulta exige el cliente propietario.</summary>
public interface IPagoRepository
{
    Task<PagedResult<Pago>> BuscarAsync(ConsultaPagosFiltro filtro, CancellationToken ct);

    Task<Pago?> ObtenerAsync(Guid clienteId, Guid id, CancellationToken ct);
}

public sealed class ConsultaInvalidaException : Exception
{
    public ConsultaInvalidaException(string message) : base(message)
    {
    }
}

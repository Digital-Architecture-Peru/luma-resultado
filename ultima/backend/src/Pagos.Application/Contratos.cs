using Pagos.Domain;

namespace Pagos.Application;

public sealed record FiltroPagos(
    string ClienteId,
    DateTimeOffset Desde,
    DateTimeOffset Hasta,
    EstadoPago? Estado,
    int Page,
    int PageSize);

public sealed record ResultadoPaginado<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public sealed record PagoDto(
    Guid Id,
    string Referencia,
    string Beneficiario,
    string CuentaDestinoMask,
    string Monto,
    string Moneda,
    string Estado,
    DateTimeOffset FechaPago,
    string Canal);

/// <summary>Puerto de persistencia (solo lectura).</summary>
public interface IPagosRepository
{
    Task<ResultadoPaginado<Pago>> BuscarAsync(FiltroPagos filtro, CancellationToken ct);
    Task<Pago?> ObtenerPorIdAsync(string clienteId, Guid id, CancellationToken ct);
}

/// <summary>Resuelve el cliente autenticado. Nunca se toma del cliente HTTP.</summary>
public interface IClienteActual
{
    string ClienteId { get; }
}

public sealed class ConsultaInvalidaException : Exception
{
    public ConsultaInvalidaException(string message) : base(message) { }
}

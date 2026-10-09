using Pagos.Domain;

namespace Pagos.Application;

/// <summary>Filtro ya validado que recibe el repositorio.</summary>
public sealed record FiltroPagos(
    IReadOnlyList<string> CuentaIds,
    DateTimeOffset Desde,
    DateTimeOffset Hasta,
    EstadoPago? Estado,
    int Page,
    int Size);

public sealed record PaginaPagos(IReadOnlyList<Pago> Items, int Total);

/// <summary>Puerto de acceso a datos (solo lectura).</summary>
public interface IPagoRepository
{
    Task<PaginaPagos> BuscarAsync(FiltroPagos filtro, CancellationToken ct);

    Task<Pago?> ObtenerAsync(Guid id, IReadOnlyList<string> cuentaIds, CancellationToken ct);
}

/// <summary>Cliente autenticado por el canal (gateway/BFF). Aquí se simula con un stub.</summary>
public interface ICurrentCustomer
{
    IReadOnlyList<string> CuentaIds { get; }
}

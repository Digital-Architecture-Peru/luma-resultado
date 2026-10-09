using Pagos.Application;
using Pagos.Domain;

namespace Pagos.UnitTests;

internal sealed class RelojFijo : TimeProvider
{
    private readonly DateTimeOffset _ahora;

    public RelojFijo(DateTimeOffset ahora)
    {
        _ahora = ahora;
    }

    public override DateTimeOffset GetUtcNow() => _ahora;
}

internal sealed class ClienteFijo : ICurrentCustomer
{
    public ClienteFijo(params string[] cuentas)
    {
        CuentaIds = cuentas;
    }

    public IReadOnlyList<string> CuentaIds { get; }
}

/// <summary>Repositorio en memoria que aplica las mismas reglas de filtrado que el real.</summary>
internal sealed class RepositorioEnMemoria : IPagoRepository
{
    private readonly List<Pago> _pagos;

    public RepositorioEnMemoria(IEnumerable<Pago> pagos)
    {
        _pagos = pagos.ToList();
    }

    public FiltroPagos? UltimoFiltro { get; private set; }

    public Task<PaginaPagos> BuscarAsync(FiltroPagos filtro, CancellationToken ct)
    {
        UltimoFiltro = filtro;
        var coincidencias = _pagos
            .Where(p => filtro.CuentaIds.Contains(p.CuentaId))
            .Where(p => p.FechaPago >= filtro.Desde && p.FechaPago <= filtro.Hasta)
            .Where(p => filtro.Estado is null || p.Estado == filtro.Estado)
            .OrderByDescending(p => p.FechaPago)
            .ToList();

        var pagina = coincidencias.Skip((filtro.Page - 1) * filtro.Size).Take(filtro.Size).ToList();
        return Task.FromResult(new PaginaPagos(pagina, coincidencias.Count));
    }

    public Task<Pago?> ObtenerAsync(Guid id, IReadOnlyList<string> cuentaIds, CancellationToken ct)
        => Task.FromResult(_pagos.FirstOrDefault(p => p.Id == id && cuentaIds.Contains(p.CuentaId)));
}

internal static class Datos
{
    public static readonly DateTimeOffset Ahora = new(2026, 10, 9, 12, 0, 0, TimeSpan.Zero);

    public static Pago Pago(string cuenta, int diasAtras, EstadoPago estado = EstadoPago.Procesado) => new(
        Guid.NewGuid(), cuenta, $"REF-{diasAtras}", "Beneficiario Ficticio", 150.75m, "USD",
        estado, Ahora.AddDays(-diasAtras), "WEB");
}

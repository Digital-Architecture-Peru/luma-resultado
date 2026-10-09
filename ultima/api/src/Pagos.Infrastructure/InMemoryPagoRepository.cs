using Pagos.Application;
using Pagos.Domain;

namespace Pagos.Infrastructure;

/// <summary>Repositorio en memoria con datos ficticios; se usa cuando no hay cadena de conexión.</summary>
public sealed class InMemoryPagoRepository : IPagoRepository
{
    public static readonly Guid ClienteDemo = Guid.Parse("11111111-1111-1111-1111-111111111111");

    private readonly IReadOnlyList<Pago> _pagos;

    public InMemoryPagoRepository(IEnumerable<Pago> pagos)
    {
        _pagos = pagos.ToList();
    }

    public Task<PagedResult<Pago>> BuscarAsync(ConsultaPagosFiltro filtro, CancellationToken ct)
    {
        var coincidencias = _pagos
            .Where(p => p.ClienteId == filtro.ClienteId)
            .Where(p => p.FechaPago >= filtro.Desde && p.FechaPago <= filtro.Hasta)
            .Where(p => filtro.Estado is null || p.Estado == filtro.Estado)
            .OrderByDescending(p => p.FechaPago)
            .ToList();

        var pagina = coincidencias
            .Skip((filtro.Page - 1) * filtro.PageSize)
            .Take(filtro.PageSize)
            .ToList();

        return Task.FromResult(new PagedResult<Pago>(pagina, filtro.Page, filtro.PageSize, coincidencias.Count));
    }

    public Task<Pago?> ObtenerAsync(Guid clienteId, Guid id, CancellationToken ct)
    {
        var pago = _pagos.FirstOrDefault(p => p.Id == id && p.ClienteId == clienteId);
        return Task.FromResult(pago);
    }

    public static InMemoryPagoRepository CrearDemo(TimeProvider reloj)
    {
        var ahora = reloj.GetUtcNow();
        var beneficiarios = new[] { "Empresa Eléctrica Ficticia", "Agua Potable Demo", "Colegio Ejemplo", "Telecom Prueba", "Alquiler Demo" };
        var estados = new[] { EstadoPago.Procesado, EstadoPago.Pendiente, EstadoPago.Rechazado, EstadoPago.Reversado };

        var pagos = Enumerable.Range(1, 10).Select(i => new Pago(
            Guid.Parse($"00000000-0000-0000-0000-{i:D12}"),
            ClienteDemo,
            $"REF-DEMO-{i:D4}",
            beneficiarios[i % beneficiarios.Length],
            $"****{1000 + i * 111}",
            Math.Round(25m + i * 13.45m, 2),
            "USD",
            estados[i % estados.Length],
            ahora.AddDays(-i * 2)));

        return new InMemoryPagoRepository(pagos);
    }
}

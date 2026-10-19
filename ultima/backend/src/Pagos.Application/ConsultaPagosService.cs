using System.Globalization;
using Pagos.Domain;

namespace Pagos.Application;

public sealed class ConsultaPagosService
{
    public const int PageSizeDefault = 20;
    public const int PageSizeMaximo = 50;
    public const int RangoMaximoDias = 366;
    private const int VentanaPorDefectoDias = 30;

    private readonly IPagosRepository _repositorio;
    private readonly TimeProvider _reloj;

    public ConsultaPagosService(IPagosRepository repositorio, TimeProvider reloj)
    {
        _repositorio = repositorio;
        _reloj = reloj;
    }

    public async Task<ResultadoPaginado<PagoDto>> ConsultarAsync(
        string clienteId,
        DateTimeOffset? desde,
        DateTimeOffset? hasta,
        string? estado,
        int? page,
        int? pageSize,
        CancellationToken ct = default)
    {
        var filtro = ConstruirFiltro(clienteId, desde, hasta, estado, page, pageSize);
        var resultado = await _repositorio.BuscarAsync(filtro, ct);
        var items = resultado.Items.Select(Mapear).ToList();
        return new ResultadoPaginado<PagoDto>(items, resultado.Total, filtro.Page, filtro.PageSize);
    }

    public async Task<PagoDto?> ObtenerAsync(string clienteId, Guid id, CancellationToken ct = default)
    {
        var pago = await _repositorio.ObtenerPorIdAsync(clienteId, id, ct);
        return pago is null ? null : Mapear(pago);
    }

    private FiltroPagos ConstruirFiltro(
        string clienteId, DateTimeOffset? desde, DateTimeOffset? hasta,
        string? estado, int? page, int? pageSize)
    {
        var fin = hasta ?? _reloj.GetUtcNow();
        var inicio = desde ?? fin.AddDays(-VentanaPorDefectoDias);

        if (inicio > fin)
            throw new ConsultaInvalidaException("'desde' no puede ser posterior a 'hasta'.");
        if ((fin - inicio).TotalDays > RangoMaximoDias)
            throw new ConsultaInvalidaException("El rango máximo de consulta es de 12 meses.");

        var pagina = page ?? 1;
        var tamano = pageSize ?? PageSizeDefault;
        if (pagina < 1)
            throw new ConsultaInvalidaException("'page' debe ser mayor o igual a 1.");
        if (tamano < 1 || tamano > PageSizeMaximo)
            throw new ConsultaInvalidaException($"'pageSize' debe estar entre 1 y {PageSizeMaximo}.");

        return new FiltroPagos(clienteId, inicio, fin, ParsearEstado(estado), pagina, tamano);
    }

    private static EstadoPago? ParsearEstado(string? estado)
    {
        if (string.IsNullOrWhiteSpace(estado)) return null;
        if (Enum.TryParse<EstadoPago>(estado, ignoreCase: true, out var valor)
            && Enum.IsDefined(valor))
            return valor;
        throw new ConsultaInvalidaException("'estado' debe ser PENDIENTE, APLICADO o RECHAZADO.");
    }

    private static PagoDto Mapear(Pago p) => new(
        p.Id,
        p.Referencia,
        p.Beneficiario,
        p.CuentaDestinoMask,
        p.Monto.ToString("F2", CultureInfo.InvariantCulture),
        p.Moneda,
        p.Estado.ToString().ToUpperInvariant(),
        p.FechaPago,
        p.Canal);
}

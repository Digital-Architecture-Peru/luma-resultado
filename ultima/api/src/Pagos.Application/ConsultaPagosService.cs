using Pagos.Domain;

namespace Pagos.Application;

public sealed class ConsultaPagosService
{
    public const int PageSizeMaximo = 50;
    public const int PageSizePorDefecto = 20;
    public const int RangoMaximoDias = 90;
    public const int VentanaPorDefectoDias = 30;

    private readonly IPagoRepository _repositorio;
    private readonly TimeProvider _reloj;

    public ConsultaPagosService(IPagoRepository repositorio, TimeProvider reloj)
    {
        _repositorio = repositorio;
        _reloj = reloj;
    }

    public async Task<PagedResult<PagoDto>> ListarAsync(
        Guid clienteId,
        DateTimeOffset? desde,
        DateTimeOffset? hasta,
        string? estado,
        int? page,
        int? pageSize,
        CancellationToken ct)
    {
        ValidarCliente(clienteId);
        var paginaActual = page ?? 1;
        var tamano = pageSize ?? PageSizePorDefecto;
        if (paginaActual < 1)
        {
            throw new ConsultaInvalidaException("page debe ser mayor o igual a 1.");
        }

        if (tamano < 1 || tamano > PageSizeMaximo)
        {
            throw new ConsultaInvalidaException($"pageSize debe estar entre 1 y {PageSizeMaximo}.");
        }

        var fin = hasta ?? _reloj.GetUtcNow();
        var inicio = desde ?? fin.AddDays(-VentanaPorDefectoDias);
        if (inicio > fin)
        {
            throw new ConsultaInvalidaException("desde no puede ser posterior a hasta.");
        }

        if (fin - inicio > TimeSpan.FromDays(RangoMaximoDias))
        {
            throw new ConsultaInvalidaException($"El rango no puede superar {RangoMaximoDias} días.");
        }

        var filtro = new ConsultaPagosFiltro(clienteId, inicio, fin, ParsearEstado(estado), paginaActual, tamano);
        var resultado = await _repositorio.BuscarAsync(filtro, ct);
        var items = resultado.Items.Select(PagoDto.Desde).ToList();
        return new PagedResult<PagoDto>(items, resultado.Page, resultado.PageSize, resultado.Total);
    }

    public async Task<PagoDto?> ObtenerAsync(Guid clienteId, Guid id, CancellationToken ct)
    {
        ValidarCliente(clienteId);
        var pago = await _repositorio.ObtenerAsync(clienteId, id, ct);
        return pago is null ? null : PagoDto.Desde(pago);
    }

    private static void ValidarCliente(Guid clienteId)
    {
        if (clienteId == Guid.Empty)
        {
            throw new ConsultaInvalidaException("Cliente no identificado.");
        }
    }

    private static EstadoPago? ParsearEstado(string? estado)
    {
        if (string.IsNullOrWhiteSpace(estado))
        {
            return null;
        }

        if (Enum.TryParse<EstadoPago>(estado.Trim(), ignoreCase: true, out var valor)
            && Enum.IsDefined(valor))
        {
            return valor;
        }

        throw new ConsultaInvalidaException("estado no válido. Use PENDIENTE, PROCESADO, RECHAZADO o REVERSADO.");
    }
}

using Pagos.Domain;

namespace Pagos.Application;

public sealed record ConsultarPagosQuery(
    DateTimeOffset? Desde,
    DateTimeOffset? Hasta,
    string? Estado,
    int Page = 1,
    int Size = 20);

public sealed class ConsultaInvalidaException : Exception
{
    public ConsultaInvalidaException(IReadOnlyList<string> errores)
        : base("La consulta de pagos no es válida.")
    {
        Errores = errores;
    }

    public IReadOnlyList<string> Errores { get; }
}

public static class ConsultarPagosValidator
{
    public const int MaxSize = 100;
    public const int MaxDiasRango = 90;
    public const int DiasPorDefecto = 30;

    public static IReadOnlyList<string> Validar(ConsultarPagosQuery query)
    {
        var errores = new List<string>();

        if (query.Page < 1) errores.Add("page debe ser mayor o igual a 1.");
        if (query.Size < 1 || query.Size > MaxSize) errores.Add($"size debe estar entre 1 y {MaxSize}.");

        if (!string.IsNullOrWhiteSpace(query.Estado) && !EstadoPagoExtensions.TryParse(query.Estado, out _))
            errores.Add("estado debe ser PENDIENTE, PROCESADO, RECHAZADO o ANULADO.");

        if (query.Desde is { } desde && query.Hasta is { } hasta)
        {
            if (desde > hasta)
                errores.Add("desde no puede ser posterior a hasta.");
            else if ((hasta - desde).TotalDays > MaxDiasRango)
                errores.Add($"El rango de fechas no puede superar {MaxDiasRango} días.");
        }

        return errores;
    }
}

public sealed class ConsultarPagosHandler
{
    private readonly IPagoRepository _repositorio;
    private readonly ICurrentCustomer _cliente;
    private readonly TimeProvider _reloj;

    public ConsultarPagosHandler(IPagoRepository repositorio, ICurrentCustomer cliente, TimeProvider reloj)
    {
        _repositorio = repositorio;
        _cliente = cliente;
        _reloj = reloj;
    }

    public async Task<ResultadoPaginado<PagoDto>> HandleAsync(ConsultarPagosQuery query, CancellationToken ct = default)
    {
        var errores = ConsultarPagosValidator.Validar(query);
        if (errores.Count > 0) throw new ConsultaInvalidaException(errores);

        var hasta = query.Hasta ?? _reloj.GetUtcNow();
        var desde = query.Desde ?? hasta.AddDays(-ConsultarPagosValidator.DiasPorDefecto);
        if ((hasta - desde).TotalDays > ConsultarPagosValidator.MaxDiasRango)
            throw new ConsultaInvalidaException(new[] { $"El rango de fechas no puede superar {ConsultarPagosValidator.MaxDiasRango} días." });
        if (desde > hasta)
            throw new ConsultaInvalidaException(new[] { "desde no puede ser posterior a hasta." });

        EstadoPago? estado = null;
        if (!string.IsNullOrWhiteSpace(query.Estado) && EstadoPagoExtensions.TryParse(query.Estado, out var parsed))
            estado = parsed;

        var filtro = new FiltroPagos(_cliente.CuentaIds, desde, hasta, estado, query.Page, query.Size);
        var pagina = await _repositorio.BuscarAsync(filtro, ct);

        return new ResultadoPaginado<PagoDto>(
            pagina.Items.Select(PagoDto.Desde).ToList(),
            query.Page,
            query.Size,
            pagina.Total);
    }
}

public sealed class ObtenerPagoHandler
{
    private readonly IPagoRepository _repositorio;
    private readonly ICurrentCustomer _cliente;

    public ObtenerPagoHandler(IPagoRepository repositorio, ICurrentCustomer cliente)
    {
        _repositorio = repositorio;
        _cliente = cliente;
    }

    /// <summary>Devuelve null si no existe o no pertenece al cliente (no se revela cuál).</summary>
    public async Task<PagoDto?> HandleAsync(Guid id, CancellationToken ct = default)
    {
        var pago = await _repositorio.ObtenerAsync(id, _cliente.CuentaIds, ct);
        return pago is null ? null : PagoDto.Desde(pago);
    }
}

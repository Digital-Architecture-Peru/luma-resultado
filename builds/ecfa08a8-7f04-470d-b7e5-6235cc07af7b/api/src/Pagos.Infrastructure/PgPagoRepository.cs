using Dapper;
using Npgsql;
using Pagos.Application;
using Pagos.Domain;

namespace Pagos.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL parametrizado; cliente_id siempre está en el WHERE.</summary>
public sealed class PgPagoRepository : IPagoRepository
{
    private const string Columnas =
        "id AS Id, cliente_id AS ClienteId, referencia AS Referencia, beneficiario AS Beneficiario, " +
        "cuenta_destino_mask AS CuentaDestinoMask, monto AS Monto, moneda AS Moneda, " +
        "estado AS Estado, fecha_pago AS FechaPago";

    private readonly NpgsqlDataSource _origen;

    public PgPagoRepository(NpgsqlDataSource origen)
    {
        _origen = origen;
    }

    public async Task<PagedResult<Pago>> BuscarAsync(ConsultaPagosFiltro filtro, CancellationToken ct)
    {
        var parametros = new DynamicParameters();
        parametros.Add("clienteId", filtro.ClienteId);
        parametros.Add("desde", filtro.Desde.UtcDateTime);
        parametros.Add("hasta", filtro.Hasta.UtcDateTime);

        var where = "WHERE cliente_id = @clienteId AND fecha_pago >= @desde AND fecha_pago <= @hasta";
        if (filtro.Estado is { } estado)
        {
            where += " AND estado = @estado";
            parametros.Add("estado", estado.ToString().ToUpperInvariant());
        }

        parametros.Add("limite", filtro.PageSize);
        parametros.Add("salto", (filtro.Page - 1) * filtro.PageSize);

        var sqlTotal = $"SELECT COUNT(*) FROM pagos {where}";
        var sqlPagina = $"SELECT {Columnas} FROM pagos {where} ORDER BY fecha_pago DESC, id LIMIT @limite OFFSET @salto";

        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var total = await conexion.ExecuteScalarAsync<int>(new CommandDefinition(sqlTotal, parametros, cancellationToken: ct));
        var filas = await conexion.QueryAsync<PagoFila>(new CommandDefinition(sqlPagina, parametros, cancellationToken: ct));

        var items = filas.Select(f => f.ADominio()).ToList();
        return new PagedResult<Pago>(items, filtro.Page, filtro.PageSize, total);
    }

    public async Task<Pago?> ObtenerAsync(Guid clienteId, Guid id, CancellationToken ct)
    {
        var sql = $"SELECT {Columnas} FROM pagos WHERE cliente_id = @clienteId AND id = @id";
        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var fila = await conexion.QuerySingleOrDefaultAsync<PagoFila>(
            new CommandDefinition(sql, new { clienteId, id }, cancellationToken: ct));
        return fila?.ADominio();
    }

    private sealed class PagoFila
    {
        public Guid Id { get; set; }

        public Guid ClienteId { get; set; }

        public string Referencia { get; set; } = string.Empty;

        public string Beneficiario { get; set; } = string.Empty;

        public string CuentaDestinoMask { get; set; } = string.Empty;

        public decimal Monto { get; set; }

        public string Moneda { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public DateTime FechaPago { get; set; }

        public Pago ADominio() => new(
            Id,
            ClienteId,
            Referencia,
            Beneficiario,
            CuentaDestinoMask,
            Monto,
            Moneda.Trim(),
            Enum.Parse<EstadoPago>(Estado, ignoreCase: true),
            new DateTimeOffset(DateTime.SpecifyKind(FechaPago, DateTimeKind.Utc)));
    }
}

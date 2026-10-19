using Dapper;
using Npgsql;
using Pagos.Application;
using Pagos.Domain;

namespace Pagos.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL parametrizado (Dapper). Solo lectura.</summary>
public sealed class PgPagosRepository : IPagosRepository
{
    private const string Columnas = @"id AS Id, cliente_id AS ClienteId, referencia AS Referencia,
        beneficiario AS Beneficiario, cuenta_destino_mask AS CuentaDestinoMask, monto AS Monto,
        moneda AS Moneda, estado AS Estado, fecha_pago AS FechaPago, canal AS Canal";

    private const string Filtros = @"WHERE cliente_id = @clienteId
          AND fecha_pago >= @desde AND fecha_pago <= @hasta
          AND (@estado::text IS NULL OR estado = @estado)";

    private readonly NpgsqlDataSource _origen;

    public PgPagosRepository(NpgsqlDataSource origen)
    {
        _origen = origen;
    }

    public async Task<ResultadoPaginado<Pago>> BuscarAsync(FiltroPagos filtro, CancellationToken ct)
    {
        var parametros = new
        {
            clienteId = filtro.ClienteId,
            desde = filtro.Desde.UtcDateTime,
            hasta = filtro.Hasta.UtcDateTime,
            estado = filtro.Estado?.ToString().ToUpperInvariant(),
            limite = filtro.PageSize,
            salto = (filtro.Page - 1) * filtro.PageSize
        };

        const string sqlConteo = "SELECT COUNT(*) FROM pagos " + Filtros;
        const string sqlPagina = "SELECT " + Columnas + " FROM pagos " + Filtros +
                                 " ORDER BY fecha_pago DESC, id LIMIT @limite OFFSET @salto";

        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var total = await conexion.ExecuteScalarAsync<int>(new CommandDefinition(sqlConteo, parametros, cancellationToken: ct));
        var filas = await conexion.QueryAsync<PagoFila>(new CommandDefinition(sqlPagina, parametros, cancellationToken: ct));
        var items = filas.Select(f => f.ADominio()).ToList();
        return new ResultadoPaginado<Pago>(items, total, filtro.Page, filtro.PageSize);
    }

    public async Task<Pago?> ObtenerPorIdAsync(string clienteId, Guid id, CancellationToken ct)
    {
        const string sql = "SELECT " + Columnas + " FROM pagos WHERE id = @id AND cliente_id = @clienteId";
        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var fila = await conexion.QuerySingleOrDefaultAsync<PagoFila>(
            new CommandDefinition(sql, new { id, clienteId }, cancellationToken: ct));
        return fila?.ADominio();
    }

    private sealed class PagoFila
    {
        public Guid Id { get; set; }
        public string ClienteId { get; set; } = "";
        public string Referencia { get; set; } = "";
        public string Beneficiario { get; set; } = "";
        public string CuentaDestinoMask { get; set; } = "";
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = "";
        public string Estado { get; set; } = "";
        public DateTime FechaPago { get; set; }
        public string Canal { get; set; } = "";

        public Pago ADominio() => new(
            Id, ClienteId, Referencia, Beneficiario, CuentaDestinoMask, Monto, Moneda,
            Enum.Parse<EstadoPago>(Estado, ignoreCase: true),
            new DateTimeOffset(DateTime.SpecifyKind(FechaPago, DateTimeKind.Utc)),
            Canal);
    }
}

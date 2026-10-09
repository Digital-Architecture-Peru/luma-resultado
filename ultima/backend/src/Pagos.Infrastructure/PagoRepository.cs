using System.Text;
using Dapper;
using Npgsql;
using Pagos.Application;
using Pagos.Domain;

namespace Pagos.Infrastructure;

/// <summary>Repositorio PostgreSQL de solo lectura. Todas las entradas viajan como parámetros.</summary>
public sealed class PagoRepository : IPagoRepository
{
    private const string Columnas =
        "id AS Id, cuenta_id AS CuentaId, referencia AS Referencia, beneficiario AS Beneficiario, " +
        "monto AS Monto, moneda AS Moneda, estado AS Estado, fecha_pago AS FechaPago, canal AS Canal";

    private readonly NpgsqlDataSource _origen;

    public PagoRepository(NpgsqlDataSource origen)
    {
        _origen = origen;
    }

    public async Task<PaginaPagos> BuscarAsync(FiltroPagos filtro, CancellationToken ct)
    {
        if (filtro.CuentaIds.Count == 0) return new PaginaPagos(Array.Empty<Pago>(), 0);

        var where = new StringBuilder(
            "WHERE cuenta_id = ANY(@cuentas) AND fecha_pago >= @desde AND fecha_pago <= @hasta");
        var parametros = new DynamicParameters();
        parametros.Add("cuentas", filtro.CuentaIds.ToArray());
        parametros.Add("desde", filtro.Desde.UtcDateTime);
        parametros.Add("hasta", filtro.Hasta.UtcDateTime);

        if (filtro.Estado is { } estado)
        {
            where.Append(" AND estado = @estado");
            parametros.Add("estado", estado.ToCodigo());
        }

        parametros.Add("limite", filtro.Size);
        parametros.Add("desplazamiento", (filtro.Page - 1) * filtro.Size);

        var sqlTotal = $"SELECT COUNT(*) FROM pagos {where}";
        var sqlPagina = $"SELECT {Columnas} FROM pagos {where} " +
                        "ORDER BY fecha_pago DESC, id LIMIT @limite OFFSET @desplazamiento";

        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var total = await conexion.ExecuteScalarAsync<int>(new CommandDefinition(sqlTotal, parametros, cancellationToken: ct));
        var filas = await conexion.QueryAsync<FilaPago>(new CommandDefinition(sqlPagina, parametros, cancellationToken: ct));

        return new PaginaPagos(filas.Select(f => f.ADominio()).ToList(), total);
    }

    public async Task<Pago?> ObtenerAsync(Guid id, IReadOnlyList<string> cuentaIds, CancellationToken ct)
    {
        if (cuentaIds.Count == 0) return null;

        var sql = $"SELECT {Columnas} FROM pagos WHERE id = @id AND cuenta_id = ANY(@cuentas)";
        var parametros = new { id, cuentas = cuentaIds.ToArray() };

        await using var conexion = await _origen.OpenConnectionAsync(ct);
        var fila = await conexion.QuerySingleOrDefaultAsync<FilaPago>(new CommandDefinition(sql, parametros, cancellationToken: ct));
        return fila?.ADominio();
    }

    private sealed class FilaPago
    {
        public Guid Id { get; set; }
        public string CuentaId { get; set; } = string.Empty;
        public string Referencia { get; set; } = string.Empty;
        public string Beneficiario { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public string Moneda { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaPago { get; set; }
        public string Canal { get; set; } = string.Empty;

        public Pago ADominio()
        {
            if (!EstadoPagoExtensions.TryParse(Estado, out var estado))
                throw new InvalidOperationException($"Estado de pago desconocido en base de datos: {Estado}");

            var fecha = DateTime.SpecifyKind(FechaPago, DateTimeKind.Utc);
            return new Pago(Id, CuentaId, Referencia, Beneficiario, Monto, Moneda, estado, new DateTimeOffset(fecha), Canal);
        }
    }
}

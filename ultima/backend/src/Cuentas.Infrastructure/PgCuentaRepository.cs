using Cuentas.Application;
using Dapper;
using Npgsql;

namespace Cuentas.Infrastructure;

/// <summary>Repositorio PostgreSQL con SQL siempre parametrizado.</summary>
public sealed class PgCuentaRepository : ICuentaRepository
{
    private const string Columnas =
        "id AS Id, cliente_id AS ClienteId, numero AS Numero, tipo AS Tipo, moneda AS Moneda, " +
        "saldo AS Saldo, estado AS Estado, actualizado_en AS ActualizadoEn";

    private readonly NpgsqlDataSource _dataSource;

    public PgCuentaRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<IReadOnlyList<Cuenta>> ListarPorClienteAsync(Guid clienteId, CancellationToken ct)
    {
        var sql = $"SELECT {Columnas} FROM cuentas WHERE cliente_id = @clienteId ORDER BY numero";
        await using var conexion = await _dataSource.OpenConnectionAsync(ct);
        var filas = await conexion.QueryAsync<Fila>(new CommandDefinition(sql, new { clienteId }, cancellationToken: ct));
        return filas.Select(f => f.ADominio()).ToList();
    }

    public async Task<Cuenta?> ObtenerAsync(Guid clienteId, Guid cuentaId, CancellationToken ct)
    {
        var sql = $"SELECT {Columnas} FROM cuentas WHERE id = @cuentaId AND cliente_id = @clienteId";
        await using var conexion = await _dataSource.OpenConnectionAsync(ct);
        var fila = await conexion.QuerySingleOrDefaultAsync<Fila>(
            new CommandDefinition(sql, new { cuentaId, clienteId }, cancellationToken: ct));
        return fila?.ADominio();
    }

    private sealed class Fila
    {
        public Guid Id { get; set; }
        public Guid ClienteId { get; set; }
        public string Numero { get; set; } = "";
        public string Tipo { get; set; } = "";
        public string Moneda { get; set; } = "";
        public decimal Saldo { get; set; }
        public string Estado { get; set; } = "";
        public DateTime ActualizadoEn { get; set; }

        public Cuenta ADominio() => new(
            Id, ClienteId, Numero, Tipo, Moneda, Saldo, Estado,
            new DateTimeOffset(DateTime.SpecifyKind(ActualizadoEn, DateTimeKind.Utc)));
    }
}

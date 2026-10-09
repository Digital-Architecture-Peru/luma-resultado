using Cuentas.Application;
using Cuentas.Domain;
using Dapper;
using Npgsql;

namespace Cuentas.Infrastructure;

public sealed class NpgsqlCuentaRepository : ICuentaRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public NpgsqlCuentaRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<IReadOnlyList<Cuenta>> ListarPorTitularAsync(Guid titularId, CancellationToken ct)
    {
        const string sql =
            "SELECT id AS Id, titular_id AS TitularId, numero_enmascarado AS NumeroEnmascarado, " +
            "moneda AS Moneda, saldo AS Saldo FROM cuentas WHERE titular_id = @titularId ORDER BY numero_enmascarado";
        await using var conexion = await _dataSource.OpenConnectionAsync(ct);
        var filas = await conexion.QueryAsync<CuentaRow>(
            new CommandDefinition(sql, new { titularId }, cancellationToken: ct));
        return filas.Select(f => f.ToDomain()).ToList();
    }
}

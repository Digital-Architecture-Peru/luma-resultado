using System.Data.Common;
using Cuentas.Application;
using Cuentas.Domain;
using Dapper;
using Npgsql;

namespace Cuentas.Infrastructure;

/// <summary>Unidad de trabajo sobre una transacción PostgreSQL (SQL siempre parametrizado).</summary>
public sealed class NpgsqlUnitOfWork : IUnitOfWork
{
    private readonly NpgsqlDataSource _dataSource;

    public NpgsqlUnitOfWork(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task<T> EjecutarAsync<T>(Func<ITransferenciaTx, Task<T>> trabajo, CancellationToken ct)
    {
        await using var conexion = await _dataSource.OpenConnectionAsync(ct);
        await using var transaccion = await conexion.BeginTransactionAsync(ct);
        try
        {
            var resultado = await trabajo(new NpgsqlTx(conexion, transaccion));
            await transaccion.CommitAsync(ct);
            return resultado;
        }
        catch
        {
            await transaccion.RollbackAsync(CancellationToken.None);
            throw;
        }
    }

    private sealed class NpgsqlTx : ITransferenciaTx
    {
        private const string ColumnasTransferencia =
            "id AS Id, origen_id AS OrigenId, destino_id AS DestinoId, monto AS Monto, moneda AS Moneda, " +
            "concepto AS Concepto, estado AS Estado, creado_en AS CreadoEn, saldo_origen AS SaldoOrigen";

        private readonly DbConnection _conexion;
        private readonly DbTransaction _transaccion;

        public NpgsqlTx(DbConnection conexion, DbTransaction transaccion)
        {
            _conexion = conexion;
            _transaccion = transaccion;
        }

        public async Task<ComprobanteTransferencia?> BuscarPorClaveAsync(string idempotencyKey, CancellationToken ct)
        {
            var sql = $"SELECT {ColumnasTransferencia} FROM transferencias WHERE idempotency_key = @clave";
            var fila = await _conexion.QuerySingleOrDefaultAsync<TransferenciaRow>(
                new CommandDefinition(sql, new { clave = idempotencyKey }, _transaccion, cancellationToken: ct));
            return fila?.ToDomain();
        }

        public async Task<IReadOnlyList<Cuenta>> BloquearCuentasAsync(Guid a, Guid b, CancellationToken ct)
        {
            const string sql =
                "SELECT id AS Id, titular_id AS TitularId, numero_enmascarado AS NumeroEnmascarado, " +
                "moneda AS Moneda, saldo AS Saldo FROM cuentas WHERE id = ANY(@ids) ORDER BY id FOR UPDATE";
            var filas = await _conexion.QueryAsync<CuentaRow>(
                new CommandDefinition(sql, new { ids = new[] { a, b } }, _transaccion, cancellationToken: ct));
            return filas.Select(f => f.ToDomain()).ToList();
        }

        public Task ActualizarSaldoAsync(Cuenta cuenta, CancellationToken ct)
        {
            const string sql = "UPDATE cuentas SET saldo = @saldo, version = version + 1 WHERE id = @id";
            return _conexion.ExecuteAsync(
                new CommandDefinition(sql, new { saldo = cuenta.Saldo, id = cuenta.Id }, _transaccion, cancellationToken: ct));
        }

        public Task InsertarTransferenciaAsync(ComprobanteTransferencia c, string idempotencyKey, CancellationToken ct)
        {
            const string sql =
                "INSERT INTO transferencias (id, idempotency_key, origen_id, destino_id, monto, moneda, concepto, " +
                "saldo_origen, estado, creado_en) VALUES (@id, @clave, @origenId, @destinoId, @monto, @moneda, " +
                "@concepto, @saldoOrigen, @estado, @creadoEn)";
            return _conexion.ExecuteAsync(new CommandDefinition(sql, new
            {
                id = c.Id, clave = idempotencyKey, origenId = c.OrigenId, destinoId = c.DestinoId,
                monto = c.Monto, moneda = c.Moneda, concepto = c.Concepto, saldoOrigen = c.SaldoOrigen,
                estado = c.Estado, creadoEn = c.CreadoEn
            }, _transaccion, cancellationToken: ct));
        }

        public Task InsertarMovimientoAsync(
            Guid cuentaId, Guid transferenciaId, char tipo, decimal monto, decimal saldoResultante,
            DateTime creadoEn, CancellationToken ct)
        {
            const string sql =
                "INSERT INTO movimientos (id, cuenta_id, transferencia_id, tipo, monto, saldo_resultante, creado_en) " +
                "VALUES (@id, @cuentaId, @transferenciaId, @tipo, @monto, @saldoResultante, @creadoEn)";
            return _conexion.ExecuteAsync(new CommandDefinition(sql, new
            {
                id = Guid.NewGuid(), cuentaId, transferenciaId, tipo = tipo.ToString(), monto,
                saldoResultante, creadoEn
            }, _transaccion, cancellationToken: ct));
        }
    }
}

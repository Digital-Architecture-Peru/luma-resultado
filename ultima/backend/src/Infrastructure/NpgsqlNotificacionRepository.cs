using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using NpgsqlTypes;
using Tarjetas.Notificaciones.Application;
using Tarjetas.Notificaciones.Domain;

namespace Tarjetas.Notificaciones.Infrastructure;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton(NpgsqlDataSource.Create(connectionString));
        services.AddScoped<INotificacionRepository, NpgsqlNotificacionRepository>();
        return services;
    }
}

/// <summary>Repositorio PostgreSQL con SQL siempre parametrizado.</summary>
public sealed class NpgsqlNotificacionRepository(NpgsqlDataSource origen) : INotificacionRepository
{
    private const string Filtro =
        "cliente_id = @cliente AND tarjeta_ref = @tarjeta AND (@leida::boolean IS NULL OR leida = @leida)";

    public async Task<(IReadOnlyList<Notificacion> Items, int Total)> ListarAsync(
        string clienteId, string tarjetaRef, bool? leida, int page, int size, CancellationToken ct)
    {
        await using var conexion = await origen.OpenConnectionAsync(ct);

        await using var conteo = new NpgsqlCommand($"SELECT count(*) FROM notificacion WHERE {Filtro}", conexion);
        AgregarFiltro(conteo, clienteId, tarjetaRef, leida);
        var total = Convert.ToInt32(await conteo.ExecuteScalarAsync(ct));

        await using var consulta = new NpgsqlCommand(
            $@"SELECT id, cliente_id, tarjeta_ref, ultimos4, tipo, titulo, mensaje, monto, moneda, leida, creada_en
               FROM notificacion WHERE {Filtro}
               ORDER BY creada_en DESC LIMIT @limite OFFSET @desde", conexion);
        AgregarFiltro(consulta, clienteId, tarjetaRef, leida);
        consulta.Parameters.AddWithValue("limite", size);
        consulta.Parameters.AddWithValue("desde", (page - 1) * size);

        var items = new List<Notificacion>();
        await using var lector = await consulta.ExecuteReaderAsync(ct);
        while (await lector.ReadAsync(ct)) items.Add(Mapear(lector));
        return (items, total);
    }

    public async Task<bool> MarcarLeidaAsync(string clienteId, Guid id, CancellationToken ct)
    {
        await using var cmd = origen.CreateCommand(
            "UPDATE notificacion SET leida = true WHERE id = @id AND cliente_id = @cliente");
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("cliente", clienteId);
        return await cmd.ExecuteNonQueryAsync(ct) > 0;
    }

    public async Task<IReadOnlyList<Preferencia>> ObtenerPreferenciasAsync(
        string clienteId, string tarjetaRef, CancellationToken ct)
    {
        await using var cmd = origen.CreateCommand(
            @"SELECT tipo, canal, habilitada, umbral_monto FROM preferencia_notificacion
              WHERE cliente_id = @cliente AND tarjeta_ref = @tarjeta ORDER BY tipo, canal");
        cmd.Parameters.AddWithValue("cliente", clienteId);
        cmd.Parameters.AddWithValue("tarjeta", tarjetaRef);

        var resultado = new List<Preferencia>();
        await using var lector = await cmd.ExecuteReaderAsync(ct);
        while (await lector.ReadAsync(ct))
        {
            resultado.Add(new Preferencia(
                clienteId, tarjetaRef,
                Enum.Parse<TipoNotificacion>(lector.GetString(0), true),
                Enum.Parse<CanalNotificacion>(lector.GetString(1), true),
                lector.GetBoolean(2),
                lector.IsDBNull(3) ? null : lector.GetDecimal(3)));
        }
        return resultado;
    }

    public async Task GuardarPreferenciasAsync(
        string clienteId, string tarjetaRef, IReadOnlyList<Preferencia> preferencias, CancellationToken ct)
    {
        await using var conexion = await origen.OpenConnectionAsync(ct);
        await using var tx = await conexion.BeginTransactionAsync(ct);

        foreach (var p in preferencias)
        {
            await using var cmd = new NpgsqlCommand(
                @"INSERT INTO preferencia_notificacion (cliente_id, tarjeta_ref, tipo, canal, habilitada, umbral_monto)
                  VALUES (@cliente, @tarjeta, @tipo, @canal, @habilitada, @umbral)
                  ON CONFLICT (cliente_id, tarjeta_ref, tipo, canal)
                  DO UPDATE SET habilitada = EXCLUDED.habilitada, umbral_monto = EXCLUDED.umbral_monto",
                conexion, tx);
            cmd.Parameters.AddWithValue("cliente", clienteId);
            cmd.Parameters.AddWithValue("tarjeta", tarjetaRef);
            cmd.Parameters.AddWithValue("tipo", p.Tipo.ToString().ToUpperInvariant());
            cmd.Parameters.AddWithValue("canal", p.Canal.ToString().ToUpperInvariant());
            cmd.Parameters.AddWithValue("habilitada", p.Habilitada);
            cmd.Parameters.Add(new NpgsqlParameter("umbral", NpgsqlDbType.Numeric)
            {
                Value = (object?)p.UmbralMonto ?? DBNull.Value
            });
            await cmd.ExecuteNonQueryAsync(ct);
        }

        await tx.CommitAsync(ct);
    }

    private static void AgregarFiltro(NpgsqlCommand cmd, string clienteId, string tarjetaRef, bool? leida)
    {
        cmd.Parameters.AddWithValue("cliente", clienteId);
        cmd.Parameters.AddWithValue("tarjeta", tarjetaRef);
        cmd.Parameters.Add(new NpgsqlParameter("leida", NpgsqlDbType.Boolean)
        {
            Value = (object?)leida ?? DBNull.Value
        });
    }

    private static Notificacion Mapear(NpgsqlDataReader r) => new(
        r.GetGuid(0),
        r.GetString(1),
        r.GetString(2),
        r.GetString(3),
        Enum.Parse<TipoNotificacion>(r.GetString(4), true),
        r.GetString(5),
        r.GetString(6),
        r.IsDBNull(7) ? null : r.GetDecimal(7),
        r.IsDBNull(8) ? null : r.GetString(8),
        r.GetBoolean(9),
        r.GetFieldValue<DateTimeOffset>(10));
}

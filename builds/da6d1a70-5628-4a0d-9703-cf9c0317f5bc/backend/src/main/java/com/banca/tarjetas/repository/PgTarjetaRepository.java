package com.banca.tarjetas.repository;

import com.banca.tarjetas.domain.EstadoTarjeta;
import com.banca.tarjetas.domain.Tarjeta;
import io.agroal.api.AgroalDataSource;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Implementación PostgreSQL con JDBC y parámetros enlazados (sin concatenar SQL). */
@ApplicationScoped
public class PgTarjetaRepository implements TarjetaRepository {

    private static final String COLUMNAS =
            "id, cliente_id, marca, tipo, ultimos4, estado, limite, saldo, moneda, vence_mes_anio";

    private final AgroalDataSource dataSource;

    public PgTarjetaRepository(AgroalDataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Tarjeta> listarPorCliente(UUID clienteId, int pagina, int tamano) {
        String sql = "SELECT " + COLUMNAS
                + " FROM tarjeta WHERE cliente_id = ? ORDER BY creado_en DESC, id LIMIT ? OFFSET ?";
        try (Connection cn = dataSource.getConnection(); PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setObject(1, clienteId);
            ps.setInt(2, tamano);
            ps.setInt(3, pagina * tamano);
            try (ResultSet rs = ps.executeQuery()) {
                List<Tarjeta> resultado = new ArrayList<>();
                while (rs.next()) {
                    resultado.add(mapear(rs));
                }
                return resultado;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando tarjetas", e);
        }
    }

    @Override
    public long contarPorCliente(UUID clienteId) {
        String sql = "SELECT count(*) FROM tarjeta WHERE cliente_id = ?";
        try (Connection cn = dataSource.getConnection(); PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setObject(1, clienteId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0L;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error contando tarjetas", e);
        }
    }

    @Override
    public Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId) {
        String sql = "SELECT " + COLUMNAS + " FROM tarjeta WHERE id = ? AND cliente_id = ?";
        try (Connection cn = dataSource.getConnection(); PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setObject(1, id);
            ps.setObject(2, clienteId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando tarjeta", e);
        }
    }

    private static Tarjeta mapear(ResultSet rs) throws SQLException {
        return new Tarjeta(
                rs.getObject("id", UUID.class),
                rs.getObject("cliente_id", UUID.class),
                rs.getString("marca"),
                rs.getString("tipo"),
                rs.getString("ultimos4"),
                EstadoTarjeta.valueOf(rs.getString("estado")),
                rs.getBigDecimal("limite"),
                rs.getBigDecimal("saldo"),
                rs.getString("moneda"),
                rs.getString("vence_mes_anio"));
    }
}

package com.demo.tarjetas.transaccion.infrastructure;

import com.demo.tarjetas.transaccion.domain.EstadoTransaccion;
import com.demo.tarjetas.transaccion.domain.TarjetaInfo;
import com.demo.tarjetas.transaccion.domain.Transaccion;
import com.demo.tarjetas.transaccion.domain.TransaccionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

/** Adaptador JDBC con consultas parametrizadas (PreparedStatement). */
@ApplicationScoped
public class JdbcTransaccionRepository implements TransaccionRepository {

    private static final String SQL_TARJETA =
            "SELECT id, cliente_id, ultimos4, tipo, estado FROM tarjeta WHERE id = ?";
    private static final String SQL_TARJETAS_CLIENTE =
            "SELECT id, cliente_id, ultimos4, tipo, estado FROM tarjeta WHERE cliente_id = ? ORDER BY id";
    private static final String SQL_POR_CLAVE =
            "SELECT id, tarjeta_id, monto, moneda, estado, idempotency_key, creado_en "
                    + "FROM transaccion WHERE idempotency_key = ?";
    private static final String SQL_INSERT =
            "INSERT INTO transaccion (id, tarjeta_id, monto, moneda, estado, idempotency_key, creado_en) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?)";
    private static final String SQL_HISTORIAL =
            "SELECT id, tarjeta_id, monto, moneda, estado, idempotency_key, creado_en "
                    + "FROM transaccion WHERE tarjeta_id = ? ORDER BY creado_en DESC LIMIT ?";

    private final DataSource dataSource;

    @Inject
    public JdbcTransaccionRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<TarjetaInfo> buscarTarjeta(long tarjetaId) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SQL_TARJETA)) {
            ps.setLong(1, tarjetaId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapearTarjeta(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw fallo("buscar tarjeta", e);
        }
    }

    @Override
    public List<TarjetaInfo> tarjetasDeCliente(String clienteId) {
        List<TarjetaInfo> resultado = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(SQL_TARJETAS_CLIENTE)) {
            ps.setString(1, clienteId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    resultado.add(mapearTarjeta(rs));
                }
            }
            return resultado;
        } catch (SQLException e) {
            throw fallo("listar tarjetas", e);
        }
    }

    @Override
    public Optional<Transaccion> buscarPorClave(String idempotencyKey) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SQL_POR_CLAVE)) {
            ps.setString(1, idempotencyKey);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapearTransaccion(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw fallo("buscar por clave", e);
        }
    }

    @Override
    public void guardar(Transaccion t) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SQL_INSERT)) {
            ps.setObject(1, t.id());
            ps.setLong(2, t.tarjetaId());
            ps.setBigDecimal(3, t.monto());
            ps.setString(4, t.moneda());
            ps.setString(5, t.estado().name());
            ps.setString(6, t.idempotencyKey());
            ps.setTimestamp(7, Timestamp.from(t.creadoEn()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw fallo("guardar transaccion", e);
        }
    }

    @Override
    public List<Transaccion> historial(long tarjetaId, int limite) {
        List<Transaccion> resultado = new ArrayList<>();
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SQL_HISTORIAL)) {
            ps.setLong(1, tarjetaId);
            ps.setInt(2, limite);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    resultado.add(mapearTransaccion(rs));
                }
            }
            return resultado;
        } catch (SQLException e) {
            throw fallo("consultar historial", e);
        }
    }

    private static TarjetaInfo mapearTarjeta(ResultSet rs) throws SQLException {
        return new TarjetaInfo(rs.getLong("id"), rs.getString("cliente_id"), rs.getString("ultimos4"),
                rs.getString("tipo"), rs.getString("estado"));
    }

    private static Transaccion mapearTransaccion(ResultSet rs) throws SQLException {
        return new Transaccion(
                rs.getObject("id", UUID.class),
                rs.getLong("tarjeta_id"),
                rs.getBigDecimal("monto"),
                rs.getString("moneda").trim(),
                EstadoTransaccion.valueOf(rs.getString("estado")),
                rs.getString("idempotency_key"),
                rs.getTimestamp("creado_en").toInstant());
    }

    private static IllegalStateException fallo(String operacion, SQLException e) {
        return new IllegalStateException("Error de persistencia al " + operacion, e);
    }
}

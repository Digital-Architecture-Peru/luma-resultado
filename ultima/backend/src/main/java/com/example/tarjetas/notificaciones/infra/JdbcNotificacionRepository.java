package com.example.tarjetas.notificaciones.infra;

import com.example.tarjetas.notificaciones.domain.Notificacion;
import com.example.tarjetas.notificaciones.domain.TipoNotificacion;
import com.example.tarjetas.notificaciones.port.NotificacionRepository;
import com.example.tarjetas.notificaciones.port.RepositorioException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;

/** Adaptador JDBC: solo fragmentos SQL constantes y parámetros enlazados. */
@ApplicationScoped
public class JdbcNotificacionRepository implements NotificacionRepository {

    private static final String COLUMNAS =
            "id, tarjeta_id, ultimos4, tipo, mensaje, leida, creada_en";
    private static final String FILTRO_LEIDA = " AND leida = ?";

    private final DataSource dataSource;

    @Inject
    public JdbcNotificacionRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Notificacion> buscar(String tarjetaId, Boolean leida, int offset, int limit) {
        String sql = "SELECT " + COLUMNAS + " FROM notificacion WHERE tarjeta_id = ?"
                + (leida != null ? FILTRO_LEIDA : "")
                + " ORDER BY creada_en DESC, id DESC LIMIT ? OFFSET ?";
        try (Connection cn = dataSource.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            int i = enlazarFiltros(ps, tarjetaId, leida);
            ps.setInt(i++, limit);
            ps.setInt(i, offset);
            try (ResultSet rs = ps.executeQuery()) {
                List<Notificacion> resultado = new ArrayList<>();
                while (rs.next()) {
                    resultado.add(mapear(rs));
                }
                return resultado;
            }
        } catch (SQLException e) {
            throw new RepositorioException("Error consultando notificaciones", e);
        }
    }

    @Override
    public long contar(String tarjetaId, Boolean leida) {
        String sql = "SELECT count(*) FROM notificacion WHERE tarjeta_id = ?"
                + (leida != null ? FILTRO_LEIDA : "");
        try (Connection cn = dataSource.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            enlazarFiltros(ps, tarjetaId, leida);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            throw new RepositorioException("Error contando notificaciones", e);
        }
    }

    @Override
    public Optional<Notificacion> marcarLeida(long id) {
        String sql = "UPDATE notificacion SET leida = TRUE WHERE id = ? RETURNING " + COLUMNAS;
        try (Connection cn = dataSource.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new RepositorioException("Error actualizando la notificación " + id, e);
        }
    }

    private static int enlazarFiltros(PreparedStatement ps, String tarjetaId, Boolean leida)
            throws SQLException {
        int i = 1;
        ps.setString(i++, tarjetaId);
        if (leida != null) {
            ps.setBoolean(i++, leida);
        }
        return i;
    }

    private static Notificacion mapear(ResultSet rs) throws SQLException {
        return new Notificacion(
                rs.getLong("id"),
                rs.getString("tarjeta_id"),
                rs.getString("ultimos4"),
                TipoNotificacion.valueOf(rs.getString("tipo")),
                rs.getString("mensaje"),
                rs.getBoolean("leida"),
                rs.getObject("creada_en", OffsetDateTime.class));
    }
}

package com.example.cuentas.notificaciones.infrastructure;

import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.Pagina;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import com.example.cuentas.notificaciones.port.NotificacionRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcNotificacionRepository implements NotificacionRepository {

    private static final String COLUMNAS = "id, cuenta_id, tipo, mensaje, monto, leida, creada_en";

    private static final RowMapper<Notificacion> MAPPER = (rs, i) -> new Notificacion(
            rs.getObject("id", UUID.class),
            rs.getString("cuenta_id"),
            TipoEvento.valueOf(rs.getString("tipo")),
            rs.getString("mensaje"),
            rs.getBigDecimal("monto"),
            rs.getBoolean("leida"),
            rs.getObject("creada_en", OffsetDateTime.class).toInstant());

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcNotificacionRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Pagina<Notificacion> buscar(String cuentaId, Boolean leida, int page, int size) {
        String filtro = "WHERE cuenta_id = :cuentaId" + (leida != null ? " AND leida = :leida" : "");
        MapSqlParameterSource params = new MapSqlParameterSource("cuentaId", cuentaId);
        if (leida != null) {
            params.addValue("leida", leida);
        }
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM notificacion " + filtro, params, Long.class);
        params.addValue("limit", size).addValue("offset", (long) page * size);
        List<Notificacion> filas = jdbc.query(
                "SELECT " + COLUMNAS + " FROM notificacion " + filtro
                        + " ORDER BY creada_en DESC LIMIT :limit OFFSET :offset",
                params, MAPPER);
        return new Pagina<>(filas, page, size, total == null ? 0 : total);
    }

    @Override
    public Optional<Notificacion> buscarPorId(UUID id) {
        List<Notificacion> filas = jdbc.query(
                "SELECT " + COLUMNAS + " FROM notificacion WHERE id = :id",
                new MapSqlParameterSource("id", id), MAPPER);
        return filas.stream().findFirst();
    }

    @Override
    public void guardar(Notificacion n) {
        jdbc.update("INSERT INTO notificacion (" + COLUMNAS + ") "
                        + "VALUES (:id, :cuentaId, :tipo, :mensaje, :monto, :leida, :creadaEn)",
                new MapSqlParameterSource()
                        .addValue("id", n.id())
                        .addValue("cuentaId", n.cuentaId())
                        .addValue("tipo", n.tipo().name())
                        .addValue("mensaje", n.mensaje())
                        .addValue("monto", n.monto())
                        .addValue("leida", n.leida())
                        .addValue("creadaEn", OffsetDateTime.ofInstant(n.creadaEn(), ZoneOffset.UTC)));
    }

    @Override
    public void marcarLeida(UUID id) {
        jdbc.update("UPDATE notificacion SET leida = TRUE WHERE id = :id",
                new MapSqlParameterSource("id", id));
    }
}

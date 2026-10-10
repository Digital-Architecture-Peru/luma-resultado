package com.example.cuentas.notificaciones.infrastructure;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import com.example.cuentas.notificaciones.port.PreferenciaRepository;
import java.util.List;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPreferenciaRepository implements PreferenciaRepository {

    private static final RowMapper<Preferencia> MAPPER = (rs, i) -> new Preferencia(
            rs.getString("cuenta_id"),
            TipoEvento.valueOf(rs.getString("tipo")),
            Canal.valueOf(rs.getString("canal")),
            rs.getBoolean("activo"),
            rs.getBigDecimal("umbral_monto"));

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcPreferenciaRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Preferencia> listar(String cuentaId) {
        return jdbc.query(
                "SELECT cuenta_id, tipo, canal, activo, umbral_monto FROM preferencia_notificacion "
                        + "WHERE cuenta_id = :cuentaId ORDER BY tipo, canal",
                new MapSqlParameterSource("cuentaId", cuentaId), MAPPER);
    }

    @Override
    public void guardar(Preferencia p) {
        jdbc.update("INSERT INTO preferencia_notificacion (cuenta_id, tipo, canal, activo, umbral_monto) "
                        + "VALUES (:cuentaId, :tipo, :canal, :activo, :umbral) "
                        + "ON CONFLICT (cuenta_id, tipo, canal) "
                        + "DO UPDATE SET activo = EXCLUDED.activo, umbral_monto = EXCLUDED.umbral_monto",
                new MapSqlParameterSource()
                        .addValue("cuentaId", p.cuentaId())
                        .addValue("tipo", p.tipo().name())
                        .addValue("canal", p.canal().name())
                        .addValue("activo", p.activo())
                        .addValue("umbral", p.umbralMonto()));
    }
}

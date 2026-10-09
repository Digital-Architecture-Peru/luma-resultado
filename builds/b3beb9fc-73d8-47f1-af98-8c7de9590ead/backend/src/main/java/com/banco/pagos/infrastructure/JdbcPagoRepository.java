package com.banco.pagos.infrastructure;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.PaginaResultado;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoFiltro;
import com.banco.pagos.domain.PagoRepository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** Adaptador PostgreSQL. Los valores siempre viajan como parámetros con nombre; el SQL solo une fragmentos fijos. */
@Repository
public class JdbcPagoRepository implements PagoRepository {

    private static final String COLUMNAS =
            "id, cuenta_id, numero_cuenta, beneficiario, concepto, monto, moneda, estado, fecha_pago";

    private static final RowMapper<Pago> MAPEADOR = JdbcPagoRepository::mapear;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcPagoRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public PaginaResultado<Pago> buscar(String cuentaId, PagoFiltro filtro, int page, int size) {
        StringBuilder where = new StringBuilder(" WHERE cuenta_id = :cuentaId");
        MapSqlParameterSource params = new MapSqlParameterSource("cuentaId", cuentaId);
        if (filtro.desde() != null) {
            where.append(" AND fecha_pago >= :desde");
            params.addValue("desde", filtro.desde());
        }
        if (filtro.hastaExclusivo() != null) {
            where.append(" AND fecha_pago < :hasta");
            params.addValue("hasta", filtro.hastaExclusivo());
        }
        if (filtro.estado() != null) {
            where.append(" AND estado = :estado");
            params.addValue("estado", filtro.estado().name());
        }

        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM pago" + where, params, Long.class);

        params.addValue("limit", size);
        params.addValue("offset", (long) page * size);
        List<Pago> filas = jdbc.query(
                "SELECT " + COLUMNAS + " FROM pago" + where
                        + " ORDER BY fecha_pago DESC, id DESC LIMIT :limit OFFSET :offset",
                params, MAPEADOR);
        return new PaginaResultado<>(filas, page, size, total == null ? 0L : total);
    }

    @Override
    public Optional<Pago> buscarPorId(String cuentaId, long id) {
        List<Pago> filas = jdbc.query(
                "SELECT " + COLUMNAS + " FROM pago WHERE id = :id AND cuenta_id = :cuentaId",
                new MapSqlParameterSource("id", id).addValue("cuentaId", cuentaId), MAPEADOR);
        return filas.stream().findFirst();
    }

    private static Pago mapear(ResultSet rs, int fila) throws SQLException {
        return new Pago(
                rs.getLong("id"),
                rs.getString("cuenta_id"),
                rs.getString("numero_cuenta"),
                rs.getString("beneficiario"),
                rs.getString("concepto"),
                rs.getBigDecimal("monto"),
                rs.getString("moneda"),
                EstadoPago.valueOf(rs.getString("estado")),
                rs.getObject("fecha_pago", OffsetDateTime.class));
    }
}

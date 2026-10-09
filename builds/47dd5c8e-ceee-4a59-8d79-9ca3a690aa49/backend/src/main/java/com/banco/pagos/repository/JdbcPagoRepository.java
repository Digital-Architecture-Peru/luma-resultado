package com.banco.pagos.repository;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.Pagina;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPagoRepository implements PagoRepository {

    private static final String COLUMNAS =
            "id, cliente_id, cuenta_origen_mask, beneficiario, monto, moneda, estado, fecha_pago";

    private static final String WHERE_FILTROS = """
            WHERE cliente_id = :clienteId
              AND (CAST(:estado AS VARCHAR) IS NULL OR estado = CAST(:estado AS VARCHAR))
              AND (CAST(:desde AS TIMESTAMPTZ) IS NULL OR fecha_pago >= CAST(:desde AS TIMESTAMPTZ))
              AND (CAST(:hasta AS TIMESTAMPTZ) IS NULL OR fecha_pago < CAST(:hasta AS TIMESTAMPTZ))
            """;

    private static final RowMapper<Pago> MAPPER = (rs, n) -> new Pago(
            rs.getObject("id", UUID.class),
            rs.getString("cliente_id"),
            rs.getString("cuenta_origen_mask"),
            rs.getString("beneficiario"),
            rs.getBigDecimal("monto"),
            rs.getString("moneda").trim(),
            EstadoPago.valueOf(rs.getString("estado")),
            rs.getObject("fecha_pago", OffsetDateTime.class));

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcPagoRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Pagina<Pago> listar(FiltroPagos filtro, int page, int size) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("clienteId", filtro.clienteId())
                .addValue("estado", filtro.estado() == null ? null : filtro.estado().name())
                .addValue("desde", filtro.desde())
                .addValue("hasta", filtro.hasta());

        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM pago " + WHERE_FILTROS, params, Long.class);

        params.addValue("limit", size).addValue("offset", (long) page * size);
        List<Pago> filas = jdbc.query(
                "SELECT " + COLUMNAS + " FROM pago " + WHERE_FILTROS
                        + " ORDER BY fecha_pago DESC, id LIMIT :limit OFFSET :offset",
                params, MAPPER);
        return Pagina.de(filas, page, size, total == null ? 0 : total);
    }

    @Override
    public Optional<Pago> buscarPorId(String clienteId, UUID id) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("clienteId", clienteId)
                .addValue("id", id);
        return jdbc.query(
                "SELECT " + COLUMNAS + " FROM pago WHERE cliente_id = :clienteId AND id = :id",
                params, MAPPER).stream().findFirst();
    }
}

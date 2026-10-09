package com.banca.cuentas.persistence;

import com.banca.cuentas.domain.Cuenta;
import com.banca.cuentas.domain.EstadoCuenta;
import com.banca.cuentas.domain.TipoCuenta;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcCuentaRepository implements CuentaRepository {

    private static final String COLUMNAS = """
            id, cliente_id, numero, tipo, moneda, saldo_disponible, saldo_contable,
            estado, fecha_apertura, actualizado_en
            """;

    private static final String SQL_POR_CLIENTE =
            "SELECT " + COLUMNAS + " FROM cuenta WHERE cliente_id = :clienteId ORDER BY fecha_apertura, numero";

    private static final String SQL_POR_ID =
            "SELECT " + COLUMNAS + " FROM cuenta WHERE id = :id";

    private static final RowMapper<Cuenta> MAPPER = JdbcCuentaRepository::mapear;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCuentaRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Cuenta> buscarPorCliente(String clienteId) {
        return jdbc.query(SQL_POR_CLIENTE, new MapSqlParameterSource("clienteId", clienteId), MAPPER);
    }

    @Override
    public Optional<Cuenta> buscarPorId(UUID id) {
        return jdbc.query(SQL_POR_ID, new MapSqlParameterSource("id", id), MAPPER).stream().findFirst();
    }

    private static Cuenta mapear(ResultSet rs, int fila) throws SQLException {
        return new Cuenta(
                rs.getObject("id", UUID.class),
                rs.getString("cliente_id"),
                rs.getString("numero"),
                TipoCuenta.valueOf(rs.getString("tipo")),
                rs.getString("moneda"),
                rs.getBigDecimal("saldo_disponible"),
                rs.getBigDecimal("saldo_contable"),
                EstadoCuenta.valueOf(rs.getString("estado")),
                rs.getObject("fecha_apertura", java.time.LocalDate.class),
                rs.getObject("actualizado_en", OffsetDateTime.class));
    }
}

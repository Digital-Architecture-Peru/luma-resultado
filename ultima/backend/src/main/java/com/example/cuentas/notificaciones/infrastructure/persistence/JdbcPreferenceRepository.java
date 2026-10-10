package com.example.cuentas.notificaciones.infrastructure.persistence;

import com.example.cuentas.notificaciones.domain.Preference;
import com.example.cuentas.notificaciones.domain.ports.PreferenceRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPreferenceRepository implements PreferenceRepository {

    private static final String SELECT =
            "SELECT account_id, low_balance_threshold, deposit_enabled, withdrawal_enabled, updated_at"
            + " FROM notification_preference WHERE account_id = :accountId";

    private static final String UPSERT =
            "INSERT INTO notification_preference"
            + " (account_id, low_balance_threshold, deposit_enabled, withdrawal_enabled, updated_at)"
            + " VALUES (:accountId, :threshold, :deposit, :withdrawal, :updatedAt)"
            + " ON CONFLICT (account_id) DO UPDATE SET"
            + " low_balance_threshold = EXCLUDED.low_balance_threshold,"
            + " deposit_enabled = EXCLUDED.deposit_enabled,"
            + " withdrawal_enabled = EXCLUDED.withdrawal_enabled,"
            + " updated_at = EXCLUDED.updated_at";

    private static final RowMapper<Preference> MAPPER = (rs, row) -> new Preference(
            rs.getString("account_id"),
            rs.getBigDecimal("low_balance_threshold"),
            rs.getBoolean("deposit_enabled"),
            rs.getBoolean("withdrawal_enabled"),
            rs.getObject("updated_at", OffsetDateTime.class).toInstant());

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcPreferenceRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<Preference> find(String accountId) {
        return jdbc.query(SELECT, new MapSqlParameterSource("accountId", accountId), MAPPER)
                .stream().findFirst();
    }

    @Override
    public Preference save(Preference p) {
        jdbc.update(UPSERT, new MapSqlParameterSource()
                .addValue("accountId", p.accountId())
                .addValue("threshold", p.lowBalanceThreshold())
                .addValue("deposit", p.depositEnabled())
                .addValue("withdrawal", p.withdrawalEnabled())
                .addValue("updatedAt", OffsetDateTime.ofInstant(p.updatedAt(), ZoneOffset.UTC)));
        return p;
    }
}

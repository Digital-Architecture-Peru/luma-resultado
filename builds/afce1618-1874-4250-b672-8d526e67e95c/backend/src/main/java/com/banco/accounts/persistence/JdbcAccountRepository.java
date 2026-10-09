package com.banco.accounts.persistence;

import com.banco.accounts.domain.Account;
import com.banco.accounts.domain.AccountStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcAccountRepository implements AccountRepository {

    private static final String COLUMNS =
            "id, customer_id, account_number, type, currency, balance, status, opened_at";

    private static final String SELECT_BY_CUSTOMER =
            "SELECT " + COLUMNS + " FROM account WHERE customer_id = :customerId ORDER BY id";

    private static final String SELECT_BY_ID_AND_CUSTOMER =
            "SELECT " + COLUMNS + " FROM account WHERE id = :id AND customer_id = :customerId";

    private static final RowMapper<Account> MAPPER = JdbcAccountRepository::mapRow;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcAccountRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Account> findByCustomerId(String customerId) {
        return jdbc.query(SELECT_BY_CUSTOMER,
                new MapSqlParameterSource("customerId", customerId), MAPPER);
    }

    @Override
    public Optional<Account> findByIdAndCustomerId(long id, String customerId) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("customerId", customerId);
        return jdbc.query(SELECT_BY_ID_AND_CUSTOMER, params, MAPPER).stream().findFirst();
    }

    private static Account mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Account(
                rs.getLong("id"),
                rs.getString("customer_id"),
                rs.getString("account_number"),
                rs.getString("type"),
                rs.getString("currency"),
                rs.getBigDecimal("balance"),
                AccountStatus.valueOf(rs.getString("status")),
                rs.getDate("opened_at").toLocalDate());
    }
}

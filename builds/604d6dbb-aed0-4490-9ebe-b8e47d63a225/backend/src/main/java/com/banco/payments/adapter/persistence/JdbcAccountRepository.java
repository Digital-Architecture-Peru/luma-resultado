package com.banco.payments.adapter.persistence;

import com.banco.payments.application.ports.AccountRepository;
import com.banco.payments.domain.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcAccountRepository implements AccountRepository {

    private static final String COLUMNS = "id, customer_id, number, currency, balance, version";

    private static final RowMapper<Account> MAPPER = (rs, row) -> new Account(
            rs.getObject("id", UUID.class),
            rs.getString("customer_id"),
            rs.getString("number"),
            rs.getString("currency"),
            rs.getBigDecimal("balance"),
            rs.getLong("version"));

    private final JdbcTemplate jdbc;

    public JdbcAccountRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<Account> findById(UUID id) {
        return jdbc.query("SELECT " + COLUMNS + " FROM account WHERE id = ?", MAPPER, id)
                .stream().findFirst();
    }

    @Override
    public List<Account> findByCustomerId(String customerId) {
        return jdbc.query("SELECT " + COLUMNS + " FROM account WHERE customer_id = ? ORDER BY number",
                MAPPER, customerId);
    }

    @Override
    public boolean updateBalance(Account updated, long expectedVersion) {
        int rows = jdbc.update(
                "UPDATE account SET balance = ?, version = ? WHERE id = ? AND version = ?",
                updated.balance(), updated.version(), updated.id(), expectedVersion);
        return rows == 1;
    }
}

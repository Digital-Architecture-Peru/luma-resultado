package com.example.accounts.infrastructure.persistence;

import com.example.accounts.domain.Account;
import com.example.accounts.domain.AccountRepository;
import com.example.accounts.domain.Movement;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcAccountRepository implements AccountRepository {

    private static final RowMapper<Account> ACCOUNT_MAPPER = (rs, i) -> new Account(
            rs.getLong("id"), rs.getString("number"), rs.getLong("customer_id"),
            rs.getString("currency"), rs.getBigDecimal("balance"));

    private static final RowMapper<Movement> MOVEMENT_MAPPER = (rs, i) -> new Movement(
            rs.getLong("id"), rs.getLong("account_id"), rs.getLong("transfer_id"),
            rs.getString("type"), rs.getBigDecimal("amount"),
            rs.getTimestamp("created_at").toInstant());

    private final JdbcTemplate jdbc;

    public JdbcAccountRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Account> findByCustomer(long customerId) {
        return jdbc.query(
                "SELECT id, number, customer_id, currency, balance FROM accounts WHERE customer_id = ? ORDER BY id",
                ACCOUNT_MAPPER, customerId);
    }

    @Override
    public Optional<Account> findByIdForUpdate(long id) {
        return jdbc.query(
                "SELECT id, number, customer_id, currency, balance FROM accounts WHERE id = ? FOR UPDATE",
                ACCOUNT_MAPPER, id).stream().findFirst();
    }

    @Override
    public boolean existsForCustomer(long accountId, long customerId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM accounts WHERE id = ? AND customer_id = ?",
                Integer.class, accountId, customerId);
        return count != null && count > 0;
    }

    @Override
    public void updateBalance(long id, BigDecimal newBalance) {
        jdbc.update("UPDATE accounts SET balance = ?, version = version + 1 WHERE id = ?", newBalance, id);
    }

    @Override
    public List<Movement> findMovements(long accountId, int page, int size) {
        return jdbc.query(
                "SELECT id, account_id, transfer_id, type, amount, created_at FROM account_movements "
                        + "WHERE account_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?",
                MOVEMENT_MAPPER, accountId, size, (long) page * size);
    }
}

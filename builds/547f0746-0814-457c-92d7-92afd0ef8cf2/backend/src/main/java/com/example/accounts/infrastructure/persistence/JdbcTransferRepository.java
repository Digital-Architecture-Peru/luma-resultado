package com.example.accounts.infrastructure.persistence;

import com.example.accounts.domain.Transfer;
import com.example.accounts.domain.TransferRepository;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcTransferRepository implements TransferRepository {

    private static final RowMapper<Transfer> MAPPER = (rs, i) -> new Transfer(
            rs.getLong("id"), rs.getString("idempotency_key"), rs.getLong("source_id"),
            rs.getLong("target_id"), rs.getBigDecimal("amount"), rs.getString("currency"),
            rs.getString("description"), rs.getString("status"), rs.getTimestamp("created_at").toInstant());

    private final JdbcTemplate jdbc;

    public JdbcTransferRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<Transfer> findByIdempotencyKey(String key) {
        return jdbc.query(
                "SELECT id, idempotency_key, source_id, target_id, amount, currency, description, status, created_at "
                        + "FROM transfers WHERE idempotency_key = ?",
                MAPPER, key).stream().findFirst();
    }

    @Override
    public Transfer insert(Transfer t) {
        Long id = jdbc.queryForObject(
                "INSERT INTO transfers (idempotency_key, source_id, target_id, amount, currency, description, status, created_at) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
                Long.class, t.idempotencyKey(), t.sourceAccountId(), t.targetAccountId(), t.amount(),
                t.currency(), t.description(), t.status(), Timestamp.from(t.createdAt()));
        return t.withId(id);
    }

    @Override
    public void insertMovement(long accountId, long transferId, String type, BigDecimal amount) {
        jdbc.update("INSERT INTO account_movements (account_id, transfer_id, type, amount) VALUES (?, ?, ?, ?)",
                accountId, transferId, type, amount);
    }
}

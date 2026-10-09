package com.example.payments.infrastructure;

import com.example.payments.domain.DuplicateIdempotencyKeyException;
import com.example.payments.domain.Money;
import com.example.payments.domain.Payment;
import com.example.payments.domain.PaymentRepository;
import com.example.payments.domain.PaymentStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPaymentRepository implements PaymentRepository {

    private static final String COLUMNS =
            "id, idempotency_key, source_account, beneficiary, amount, currency, status, reference, created_at";

    private static final RowMapper<Payment> MAPPER = JdbcPaymentRepository::map;

    private final JdbcTemplate jdbc;

    public JdbcPaymentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void save(Payment p) {
        try {
            jdbc.update("INSERT INTO payment (" + COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    p.id(), p.idempotencyKey(), p.sourceAccount(), p.beneficiary(),
                    p.amount().value(), p.amount().currency(), p.status().name(), p.reference(),
                    OffsetDateTime.ofInstant(p.createdAt(), ZoneOffset.UTC));
        } catch (DuplicateKeyException e) {
            throw new DuplicateIdempotencyKeyException(p.idempotencyKey());
        }
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return jdbc.query("SELECT " + COLUMNS + " FROM payment WHERE id = ?", MAPPER, id).stream().findFirst();
    }

    @Override
    public Optional<Payment> findByIdempotencyKey(String key) {
        return jdbc.query("SELECT " + COLUMNS + " FROM payment WHERE idempotency_key = ?", MAPPER, key)
                .stream().findFirst();
    }

    @Override
    public List<Payment> findBySourceAccount(String account, int page, int size) {
        return jdbc.query("SELECT " + COLUMNS
                        + " FROM payment WHERE source_account = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
                MAPPER, account, size, (long) page * size);
    }

    private static Payment map(ResultSet rs, int row) throws SQLException {
        return Payment.restore(
                rs.getObject("id", UUID.class),
                rs.getString("idempotency_key"),
                rs.getString("source_account"),
                rs.getString("beneficiary"),
                new Money(rs.getBigDecimal("amount"), rs.getString("currency").trim()),
                rs.getString("reference"),
                PaymentStatus.valueOf(rs.getString("status")),
                rs.getObject("created_at", OffsetDateTime.class).toInstant());
    }
}

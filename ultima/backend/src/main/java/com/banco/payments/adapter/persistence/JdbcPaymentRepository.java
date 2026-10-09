package com.banco.payments.adapter.persistence;

import com.banco.payments.application.PaymentErrors;
import com.banco.payments.application.ports.PaymentRepository;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentStatus;
import java.sql.Timestamp;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPaymentRepository implements PaymentRepository {

    private static final String COLUMNS = "id, idempotency_key, source_account_id, target_account, "
            + "amount, currency, status, reference, created_at";

    private static final RowMapper<Payment> MAPPER = (rs, row) -> new Payment(
            rs.getObject("id", UUID.class),
            rs.getString("idempotency_key"),
            rs.getObject("source_account_id", UUID.class),
            rs.getString("target_account"),
            rs.getBigDecimal("amount"),
            rs.getString("currency"),
            PaymentStatus.valueOf(rs.getString("status")),
            rs.getString("reference"),
            rs.getTimestamp("created_at").toInstant());

    private final JdbcTemplate jdbc;

    public JdbcPaymentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return jdbc.query("SELECT " + COLUMNS + " FROM payment WHERE id = ?", MAPPER, id)
                .stream().findFirst();
    }

    @Override
    public Optional<Payment> findByIdempotencyKey(String idempotencyKey) {
        return jdbc.query("SELECT " + COLUMNS + " FROM payment WHERE idempotency_key = ?", MAPPER, idempotencyKey)
                .stream().findFirst();
    }

    @Override
    public Payment save(Payment payment) {
        try {
            jdbc.update("INSERT INTO payment (" + COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    payment.id(), payment.idempotencyKey(), payment.sourceAccountId(),
                    payment.targetAccount(), payment.amount(), payment.currency(),
                    payment.status().name(), payment.reference(), Timestamp.from(payment.createdAt()));
        } catch (DuplicateKeyException e) {
            throw new PaymentErrors.IdempotencyConflict("La clave de idempotencia ya fue utilizada");
        }
        return payment;
    }
}

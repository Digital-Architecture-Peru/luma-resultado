package com.banco.payments.infrastructure;

import com.banco.payments.domain.DuplicateIdempotencyKeyException;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentRepository;
import com.banco.payments.domain.PaymentStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

/** Adaptador JDBC sobre PostgreSQL; solo consultas parametrizadas. */
@ApplicationScoped
public class JdbcPaymentRepository implements PaymentRepository {

    private static final String UNIQUE_VIOLATION = "23505";
    private static final String COLUMNS =
            "id, origin_account, beneficiary, amount, currency, concept, status, idempotency_key, created_at";
    private static final String INSERT =
            "INSERT INTO payments (" + COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String BY_ID = "SELECT " + COLUMNS + " FROM payments WHERE id = ?";
    private static final String BY_KEY = "SELECT " + COLUMNS + " FROM payments WHERE idempotency_key = ?";

    private final DataSource dataSource;

    public JdbcPaymentRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(Payment p) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(INSERT)) {
            ps.setObject(1, p.id());
            ps.setString(2, p.originAccount());
            ps.setString(3, p.beneficiary());
            ps.setBigDecimal(4, p.amount());
            ps.setString(5, p.currency());
            ps.setString(6, p.concept());
            ps.setString(7, p.status().name());
            ps.setString(8, p.idempotencyKey());
            ps.setTimestamp(9, Timestamp.from(p.createdAt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            if (UNIQUE_VIOLATION.equals(e.getSQLState())) {
                throw new DuplicateIdempotencyKeyException(p.idempotencyKey());
            }
            throw new PaymentPersistenceException("No se pudo guardar el pago", e);
        }
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return queryOne(BY_ID, ps -> ps.setObject(1, id));
    }

    @Override
    public Optional<Payment> findByIdempotencyKey(String key) {
        return queryOne(BY_KEY, ps -> ps.setString(1, key));
    }

    private interface Binder {
        void bind(PreparedStatement ps) throws SQLException;
    }

    private Optional<Payment> queryOne(String sql, Binder binder) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            binder.bind(ps);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new PaymentPersistenceException("No se pudo consultar el pago", e);
        }
    }

    private static Payment map(ResultSet rs) throws SQLException {
        return new Payment(
                rs.getObject("id", UUID.class),
                rs.getString("origin_account"),
                rs.getString("beneficiary"),
                rs.getBigDecimal("amount"),
                rs.getString("currency").trim(),
                rs.getString("concept"),
                PaymentStatus.valueOf(rs.getString("status")),
                rs.getString("idempotency_key"),
                rs.getTimestamp("created_at").toInstant());
    }
}

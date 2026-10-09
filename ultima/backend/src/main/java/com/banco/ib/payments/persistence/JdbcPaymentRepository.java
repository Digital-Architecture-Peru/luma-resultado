package com.banco.ib.payments.persistence;

import com.banco.ib.payments.domain.Payment;
import com.banco.ib.payments.domain.PaymentQuery;
import com.banco.ib.payments.domain.PaymentStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

/** Acceso JDBC con PreparedStatement: los valores nunca se concatenan al SQL. */
@ApplicationScoped
public class JdbcPaymentRepository implements PaymentRepository {

    private static final String COLUMNS =
            "id, customer_id, reference, beneficiary_name, beneficiary_account_masked, "
                    + "amount, currency, status, executed_at";

    private final DataSource dataSource;

    public JdbcPaymentRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Payment> find(PaymentQuery query) {
        List<Object> params = new ArrayList<>();
        String where = buildWhere(query, params);
        String sql = "SELECT " + COLUMNS + " FROM payment" + where
                + " ORDER BY executed_at DESC NULLS FIRST, id LIMIT ? OFFSET ?";
        params.add(query.size());
        params.add(query.offset());
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, params);
            try (ResultSet rs = ps.executeQuery()) {
                List<Payment> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new PaymentRepositoryException("No se pudo consultar los pagos", e);
        }
    }

    @Override
    public long count(PaymentQuery query) {
        List<Object> params = new ArrayList<>();
        String sql = "SELECT COUNT(*) FROM payment" + buildWhere(query, params);
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, params);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0L;
            }
        } catch (SQLException e) {
            throw new PaymentRepositoryException("No se pudo contar los pagos", e);
        }
    }

    @Override
    public Optional<Payment> findById(String customerId, UUID id) {
        String sql = "SELECT " + COLUMNS + " FROM payment WHERE customer_id = ? AND id = ?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, List.of(customerId, id));
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new PaymentRepositoryException("No se pudo obtener el pago", e);
        }
    }

    /** Solo añade fragmentos fijos; los valores viajan como parámetros. */
    private static String buildWhere(PaymentQuery q, List<Object> params) {
        StringBuilder where = new StringBuilder(" WHERE customer_id = ?");
        params.add(q.customerId());
        if (q.from() != null) {
            where.append(" AND executed_at >= ?");
            params.add(OffsetDateTime.ofInstant(q.from(), ZoneOffset.UTC));
        }
        if (q.toExclusive() != null) {
            where.append(" AND executed_at < ?");
            params.add(OffsetDateTime.ofInstant(q.toExclusive(), ZoneOffset.UTC));
        }
        if (q.status() != null) {
            where.append(" AND status = ?");
            params.add(q.status().name());
        }
        return where.toString();
    }

    private static void bind(PreparedStatement ps, List<Object> params) throws SQLException {
        for (int i = 0; i < params.size(); i++) {
            ps.setObject(i + 1, params.get(i));
        }
    }

    private static Payment map(ResultSet rs) throws SQLException {
        OffsetDateTime executed = rs.getObject("executed_at", OffsetDateTime.class);
        return new Payment(
                rs.getObject("id", UUID.class),
                rs.getString("customer_id"),
                rs.getString("reference"),
                rs.getString("beneficiary_name"),
                rs.getString("beneficiary_account_masked"),
                rs.getBigDecimal("amount"),
                rs.getString("currency").trim(),
                PaymentStatus.valueOf(rs.getString("status")),
                executed == null ? null : executed.toInstant());
    }
}

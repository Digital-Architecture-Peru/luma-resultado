package com.banco.notificaciones.adapter.jdbc;

import com.banco.notificaciones.domain.Notification;
import com.banco.notificaciones.domain.NotificationType;
import com.banco.notificaciones.port.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.sql.DataSource;
import org.jboss.logging.Logger;

/** Adaptador JDBC: solo consultas parametrizadas (PreparedStatement). */
@ApplicationScoped
public class JdbcNotificationRepository implements NotificationRepository {

    private static final Logger LOG = Logger.getLogger(JdbcNotificationRepository.class);

    private static final String COLUMNS =
            "id, customer_id, payment_id, type, title, message, amount, currency, account_last4, created_at, read_at";

    private final DataSource dataSource;

    public JdbcNotificationRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Notification> findByCustomer(String customerId, boolean unreadOnly, int limit) {
        String sql = "SELECT " + COLUMNS + " FROM notification WHERE customer_id = ?"
                + (unreadOnly ? " AND read_at IS NULL" : "")
                + " ORDER BY created_at DESC LIMIT ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, customerId);
            ps.setInt(2, limit);
            try (ResultSet rs = ps.executeQuery()) {
                List<Notification> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw dataError("findByCustomer", e);
        }
    }

    @Override
    public long countUnread(String customerId) {
        String sql = "SELECT COUNT(*) FROM notification WHERE customer_id = ? AND read_at IS NULL";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0L;
            }
        } catch (SQLException e) {
            throw dataError("countUnread", e);
        }
    }

    @Override
    public boolean markRead(String customerId, UUID id, Instant readAt) {
        String sql = "UPDATE notification SET read_at = COALESCE(read_at, ?) WHERE id = ? AND customer_id = ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setTimestamp(1, Timestamp.from(readAt));
            ps.setObject(2, id);
            ps.setString(3, customerId);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            throw dataError("markRead", e);
        }
    }

    @Override
    public boolean insertIfAbsent(Notification n) {
        String sql = "INSERT INTO notification (" + COLUMNS + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
                + "ON CONFLICT (payment_id, type) DO NOTHING";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setObject(1, n.id());
            ps.setString(2, n.customerId());
            ps.setString(3, n.paymentId());
            ps.setString(4, n.type().name());
            ps.setString(5, n.title());
            ps.setString(6, n.message());
            ps.setBigDecimal(7, n.amount());
            ps.setString(8, n.currency());
            ps.setString(9, n.accountLast4());
            ps.setTimestamp(10, Timestamp.from(n.createdAt()));
            ps.setTimestamp(11, n.readAt() == null ? null : Timestamp.from(n.readAt()));
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            throw dataError("insertIfAbsent", e);
        }
    }

    private static Notification map(ResultSet rs) throws SQLException {
        Timestamp readAt = rs.getTimestamp("read_at");
        return new Notification(
                rs.getObject("id", UUID.class),
                rs.getString("customer_id"),
                rs.getString("payment_id"),
                NotificationType.valueOf(rs.getString("type")),
                rs.getString("title"),
                rs.getString("message"),
                rs.getBigDecimal("amount"),
                rs.getString("currency").trim(),
                rs.getString("account_last4").trim(),
                rs.getTimestamp("created_at").toInstant(),
                readAt == null ? null : readAt.toInstant());
    }

    private static IllegalStateException dataError(String operation, SQLException e) {
        LOG.errorf("Error de base de datos en %s (sqlState=%s)", operation, e.getSQLState());
        return new IllegalStateException("Error de acceso a datos");
    }
}

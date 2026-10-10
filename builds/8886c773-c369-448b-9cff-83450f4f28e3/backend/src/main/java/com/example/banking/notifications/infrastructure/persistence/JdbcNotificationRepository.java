package com.example.banking.notifications.infrastructure.persistence;

import com.example.banking.notifications.application.ports.NotificationRepository;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import com.example.banking.notifications.domain.NotificationType;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "id, account_id, type, title, message, status, created_at, read_at";

    private static final String SELECT_PAGE = "SELECT " + COLUMNS + " FROM notification "
            + "WHERE account_id = ? AND (CAST(? AS VARCHAR) IS NULL OR status = ?) "
            + "ORDER BY created_at DESC LIMIT ? OFFSET ?";

    private static final String SELECT_BY_ID = "SELECT " + COLUMNS + " FROM notification WHERE id = ?";

    private static final String UPSERT = "INSERT INTO notification (" + COLUMNS + ") "
            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?) "
            + "ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, read_at = EXCLUDED.read_at";

    private final DataSource dataSource;

    public JdbcNotificationRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Notification> findByAccount(String accountId, Optional<NotificationStatus> status,
                                            int page, int size) {
        String statusValue = status.map(Enum::name).orElse(null);
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SELECT_PAGE)) {
            ps.setString(1, accountId);
            ps.setString(2, statusValue);
            ps.setString(3, statusValue);
            ps.setInt(4, size);
            ps.setLong(5, (long) page * size);
            try (ResultSet rs = ps.executeQuery()) {
                List<Notification> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando notificaciones", e);
        }
    }

    @Override
    public Optional<Notification> findById(UUID id) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SELECT_BY_ID)) {
            ps.setObject(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando la notificación", e);
        }
    }

    @Override
    public void save(Notification n) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(UPSERT)) {
            ps.setObject(1, n.id());
            ps.setString(2, n.accountId());
            ps.setString(3, n.type().name());
            ps.setString(4, n.title());
            ps.setString(5, n.message());
            ps.setString(6, n.status().name());
            ps.setTimestamp(7, Timestamp.from(n.createdAt()));
            ps.setTimestamp(8, n.readAt() == null ? null : Timestamp.from(n.readAt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error guardando la notificación", e);
        }
    }

    private static Notification map(ResultSet rs) throws SQLException {
        Timestamp readAt = rs.getTimestamp("read_at");
        Instant read = readAt == null ? null : readAt.toInstant();
        return new Notification(
                rs.getObject("id", UUID.class),
                rs.getString("account_id"),
                NotificationType.valueOf(rs.getString("type")),
                rs.getString("title"),
                rs.getString("message"),
                NotificationStatus.valueOf(rs.getString("status")),
                rs.getTimestamp("created_at").toInstant(),
                read);
    }
}

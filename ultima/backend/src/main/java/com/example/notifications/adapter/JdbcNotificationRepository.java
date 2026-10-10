package com.example.notifications.adapter;

import com.example.notifications.domain.Notification;
import com.example.notifications.domain.NotificationStatus;
import com.example.notifications.domain.NotificationType;
import com.example.notifications.port.NotificationRepository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "id, customer_id, payment_reference, type, amount, currency, masked_account, status, created_at, read_at";

    private static final RowMapper<Notification> MAPPER = JdbcNotificationRepository::map;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcNotificationRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Notification save(Notification n) {
        String sql = "INSERT INTO payment_notification "
                + "(customer_id, payment_reference, type, amount, currency, masked_account, status, created_at) "
                + "VALUES (:customerId, :reference, :type, :amount, :currency, :account, :status, :createdAt)";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("customerId", n.customerId())
                .addValue("reference", n.paymentReference())
                .addValue("type", n.type().name())
                .addValue("amount", n.amount())
                .addValue("currency", n.currency())
                .addValue("account", n.maskedAccount())
                .addValue("status", n.status().name())
                .addValue("createdAt", Timestamp.from(n.createdAt()));
        KeyHolder keys = new GeneratedKeyHolder();
        jdbc.update(sql, params, keys, new String[] {"id"});
        Number key = keys.getKey();
        if (key == null) {
            throw new IllegalStateException("La base de datos no devolvió el id generado");
        }
        return n.withId(key.longValue());
    }

    @Override
    public Optional<Notification> findByReferenceAndType(String paymentReference, NotificationType type) {
        String sql = "SELECT " + COLUMNS + " FROM payment_notification "
                + "WHERE payment_reference = :reference AND type = :type";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("reference", paymentReference)
                .addValue("type", type.name()), MAPPER).stream().findFirst();
    }

    @Override
    public Optional<Notification> findByIdAndCustomer(long id, String customerId) {
        String sql = "SELECT " + COLUMNS + " FROM payment_notification "
                + "WHERE id = :id AND customer_id = :customerId";
        return jdbc.query(sql, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("customerId", customerId), MAPPER).stream().findFirst();
    }

    @Override
    public List<Notification> findByCustomer(String customerId, NotificationStatus status) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("customerId", customerId);
        String base = "SELECT " + COLUMNS + " FROM payment_notification WHERE customer_id = :customerId";
        String order = " ORDER BY created_at DESC";
        if (status == null) {
            return jdbc.query(base + order, params, MAPPER);
        }
        params.addValue("status", status.name());
        return jdbc.query(base + " AND status = :status" + order, params, MAPPER);
    }

    @Override
    public void markRead(long id, String customerId, Instant readAt) {
        String sql = "UPDATE payment_notification SET status = 'READ', read_at = :readAt "
                + "WHERE id = :id AND customer_id = :customerId AND status = 'UNREAD'";
        jdbc.update(sql, new MapSqlParameterSource()
                .addValue("readAt", Timestamp.from(readAt))
                .addValue("id", id)
                .addValue("customerId", customerId));
    }

    private static Notification map(ResultSet rs, int row) throws SQLException {
        Timestamp readAt = rs.getTimestamp("read_at");
        return new Notification(
                rs.getLong("id"),
                rs.getString("customer_id"),
                rs.getString("payment_reference"),
                NotificationType.valueOf(rs.getString("type")),
                rs.getBigDecimal("amount"),
                rs.getString("currency"),
                rs.getString("masked_account"),
                NotificationStatus.valueOf(rs.getString("status")),
                rs.getTimestamp("created_at").toInstant(),
                readAt == null ? null : readAt.toInstant());
    }
}

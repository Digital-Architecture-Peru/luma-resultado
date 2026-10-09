package com.banco.notifications.infrastructure.persistence;

import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationRepository;
import com.banco.notifications.domain.NotificationStatus;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PagedResult;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "n.id, n.card_id, n.type, n.title, n.message, n.amount, n.currency, n.status, n.created_at, n.read_at";

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcNotificationRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public PagedResult<Notification> findByCard(UUID cardId, NotificationStatus status, int page, int size) {
        String filter = status == null ? "" : " AND n.status = :status";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("cardId", cardId)
                .addValue("limit", size)
                .addValue("offset", (long) page * size);
        if (status != null) {
            params.addValue("status", status.name());
        }
        List<Notification> items = jdbc.query(
                "SELECT " + COLUMNS + " FROM notification n WHERE n.card_id = :cardId" + filter
                        + " ORDER BY n.created_at DESC LIMIT :limit OFFSET :offset",
                params, JdbcNotificationRepository::map);
        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM notification n WHERE n.card_id = :cardId" + filter, params, Long.class);
        return new PagedResult<>(items, page, size, total == null ? 0 : total);
    }

    @Override
    public Optional<Notification> findByIdForCustomer(UUID id, String customerId) {
        List<Notification> found = jdbc.query(
                "SELECT " + COLUMNS + " FROM notification n JOIN card c ON c.id = n.card_id"
                        + " WHERE n.id = :id AND c.customer_id = :customerId",
                new MapSqlParameterSource().addValue("id", id).addValue("customerId", customerId),
                JdbcNotificationRepository::map);
        return found.stream().findFirst();
    }

    @Override
    public void save(Notification notification) {
        jdbc.update("UPDATE notification SET status = :status, read_at = :readAt WHERE id = :id",
                new MapSqlParameterSource()
                        .addValue("status", notification.status().name())
                        .addValue("readAt", toOffset(notification.readAt()))
                        .addValue("id", notification.id()));
    }

    private static OffsetDateTime toOffset(Instant instant) {
        return instant == null ? null : OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
    }

    private static Notification map(ResultSet rs, int rowNum) throws SQLException {
        OffsetDateTime readAt = rs.getObject("read_at", OffsetDateTime.class);
        return new Notification(
                rs.getObject("id", UUID.class),
                rs.getObject("card_id", UUID.class),
                NotificationType.valueOf(rs.getString("type")),
                rs.getString("title"),
                rs.getString("message"),
                rs.getBigDecimal("amount"),
                rs.getString("currency"),
                NotificationStatus.valueOf(rs.getString("status")),
                rs.getObject("created_at", OffsetDateTime.class).toInstant(),
                readAt == null ? null : readAt.toInstant());
    }
}

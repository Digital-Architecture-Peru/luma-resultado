package com.banca.tarjetas.notifications.infrastructure.persistence;

import com.banca.tarjetas.notifications.application.PageResult;
import com.banca.tarjetas.notifications.application.port.NotificationRepository;
import com.banca.tarjetas.notifications.domain.Notification;
import com.banca.tarjetas.notifications.domain.NotificationStatus;
import com.banca.tarjetas.notifications.domain.NotificationType;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** Todas las consultas usan parámetros con nombre; nunca se concatenan valores. */
@Repository
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "id, customer_ref, card_ref, last4, type, title, message, status, created_at, read_at";

    private static final RowMapper<Notification> MAPPER = JdbcNotificationRepository::mapRow;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcNotificationRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public PageResult<Notification> findByCard(String customerRef, String cardRef,
                                               Optional<NotificationStatus> status,
                                               int page, int size) {
        // Fragmento fijo (no proviene del usuario); el valor del estado va parametrizado.
        String statusFilter = status.isPresent() ? " AND status = :status" : "";
        String where = " WHERE customer_ref = :customerRef AND card_ref = :cardRef" + statusFilter;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("customerRef", customerRef)
                .addValue("cardRef", cardRef)
                .addValue("limit", size)
                .addValue("offset", (long) page * size);
        status.ifPresent(s -> params.addValue("status", s.name()));

        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM card_notification" + where, params, Long.class);
        List<Notification> items = jdbc.query(
                "SELECT " + COLUMNS + " FROM card_notification" + where
                        + " ORDER BY created_at DESC LIMIT :limit OFFSET :offset",
                params, MAPPER);
        return new PageResult<>(items, page, size, total == null ? 0 : total);
    }

    @Override
    public long countUnread(String customerRef) {
        Long count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM card_notification "
                        + "WHERE customer_ref = :customerRef AND status = 'UNREAD'",
                new MapSqlParameterSource("customerRef", customerRef), Long.class);
        return count == null ? 0 : count;
    }

    @Override
    public boolean markAsRead(String customerRef, UUID id, Instant readAt) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("customerRef", customerRef)
                .addValue("id", id)
                .addValue("readAt", Timestamp.from(readAt));
        // Idempotente: si ya estaba leída conserva read_at, pero la fila existe y cuenta como éxito.
        int updated = jdbc.update(
                "UPDATE card_notification SET status = 'READ', "
                        + "read_at = COALESCE(read_at, :readAt) "
                        + "WHERE id = :id AND customer_ref = :customerRef",
                params);
        return updated > 0;
    }

    @Override
    public void save(Notification n) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", n.id())
                .addValue("customerRef", n.customerRef())
                .addValue("cardRef", n.cardRef())
                .addValue("last4", n.last4())
                .addValue("type", n.type().name())
                .addValue("title", n.title())
                .addValue("message", n.message())
                .addValue("status", n.status().name())
                .addValue("createdAt", Timestamp.from(n.createdAt()));
        jdbc.update(
                "INSERT INTO card_notification "
                        + "(id, customer_ref, card_ref, last4, type, title, message, status, created_at) "
                        + "VALUES (:id, :customerRef, :cardRef, :last4, :type, :title, :message, "
                        + ":status, :createdAt)",
                params);
    }

    private static Notification mapRow(ResultSet rs, int rowNum) throws SQLException {
        Timestamp readAt = rs.getTimestamp("read_at");
        return new Notification(
                rs.getObject("id", UUID.class),
                rs.getString("customer_ref"),
                rs.getString("card_ref"),
                rs.getString("last4"),
                NotificationType.valueOf(rs.getString("type")),
                rs.getString("title"),
                rs.getString("message"),
                NotificationStatus.valueOf(rs.getString("status")),
                rs.getTimestamp("created_at").toInstant(),
                readAt == null ? null : readAt.toInstant());
    }
}

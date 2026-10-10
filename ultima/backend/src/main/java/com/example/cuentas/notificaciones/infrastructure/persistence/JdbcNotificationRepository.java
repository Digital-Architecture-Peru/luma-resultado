package com.example.cuentas.notificaciones.infrastructure.persistence;

import com.example.cuentas.notificaciones.domain.Notification;
import com.example.cuentas.notificaciones.domain.NotificationType;
import com.example.cuentas.notificaciones.domain.ports.NotificationRepository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "id, account_id, type, message, amount, read_at, created_at";

    private static final String SELECT_ALL = "SELECT " + COLUMNS
            + " FROM account_notification WHERE account_id = :accountId"
            + " ORDER BY created_at DESC LIMIT :size OFFSET :offset";

    private static final String SELECT_UNREAD = "SELECT " + COLUMNS
            + " FROM account_notification WHERE account_id = :accountId AND read_at IS NULL"
            + " ORDER BY created_at DESC LIMIT :size OFFSET :offset";

    private static final String SELECT_BY_ID = "SELECT " + COLUMNS
            + " FROM account_notification WHERE id = :id";

    private static final String INSERT =
            "INSERT INTO account_notification (" + COLUMNS + ")"
            + " VALUES (:id, :accountId, :type, :message, :amount, :readAt, :createdAt)";

    private static final String MARK_READ =
            "UPDATE account_notification SET read_at = :readAt WHERE id = :id AND read_at IS NULL";

    private static final RowMapper<Notification> MAPPER = JdbcNotificationRepository::map;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcNotificationRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Notification> findByAccount(String accountId, boolean unreadOnly, int page, int size) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("accountId", accountId)
                .addValue("size", size)
                .addValue("offset", (long) page * size);
        return jdbc.query(unreadOnly ? SELECT_UNREAD : SELECT_ALL, params, MAPPER);
    }

    @Override
    public Optional<Notification> findById(UUID id) {
        return jdbc.query(SELECT_BY_ID, new MapSqlParameterSource("id", id), MAPPER)
                .stream().findFirst();
    }

    @Override
    public void save(Notification n) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", n.id())
                .addValue("accountId", n.accountId())
                .addValue("type", n.type().name())
                .addValue("message", n.message())
                .addValue("amount", n.amount())
                .addValue("readAt", toOffset(n.readAt()))
                .addValue("createdAt", toOffset(n.createdAt()));
        jdbc.update(INSERT, params);
    }

    @Override
    public void markRead(UUID id, Instant readAt) {
        jdbc.update(MARK_READ, new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("readAt", toOffset(readAt)));
    }

    private static OffsetDateTime toOffset(Instant instant) {
        return instant == null ? null : OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
    }

    private static Notification map(ResultSet rs, int row) throws SQLException {
        OffsetDateTime readAt = rs.getObject("read_at", OffsetDateTime.class);
        OffsetDateTime createdAt = rs.getObject("created_at", OffsetDateTime.class);
        return new Notification(
                rs.getObject("id", UUID.class),
                rs.getString("account_id"),
                NotificationType.valueOf(rs.getString("type")),
                rs.getString("message"),
                rs.getBigDecimal("amount"),
                readAt == null ? null : readAt.toInstant(),
                createdAt.toInstant());
    }
}

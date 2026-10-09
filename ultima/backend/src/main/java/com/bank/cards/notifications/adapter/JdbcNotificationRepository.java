package com.bank.cards.notifications.adapter;

import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.NotificationType;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import com.bank.cards.notifications.port.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

/** Adaptador JDBC a PostgreSQL. Todas las consultas usan parámetros; no se concatena entrada del usuario. */
@ApplicationScoped
public class JdbcNotificationRepository implements NotificationRepository {

    private static final String COLUMNS =
            "id, card_id, card_last4, type, title, message, amount, read_at, created_at";

    private static final String SELECT_ALL = "SELECT " + COLUMNS
            + " FROM card_notification WHERE card_id = ?"
            + " ORDER BY created_at DESC, id LIMIT ? OFFSET ?";
    private static final String SELECT_UNREAD = "SELECT " + COLUMNS
            + " FROM card_notification WHERE card_id = ? AND read_at IS NULL"
            + " ORDER BY created_at DESC, id LIMIT ? OFFSET ?";
    private static final String COUNT_ALL =
            "SELECT count(*) FROM card_notification WHERE card_id = ?";
    private static final String COUNT_UNREAD =
            "SELECT count(*) FROM card_notification WHERE card_id = ? AND read_at IS NULL";
    private static final String SELECT_BY_ID =
            "SELECT " + COLUMNS + " FROM card_notification WHERE id = ?";
    private static final String UPDATE_READ =
            "UPDATE card_notification SET read_at = ? WHERE id = ? AND read_at IS NULL";
    private static final String SELECT_PREFERENCES =
            "SELECT type, enabled FROM notification_preference WHERE card_id = ?";
    private static final String UPSERT_PREFERENCE =
            "INSERT INTO notification_preference (card_id, type, enabled) VALUES (?, ?, ?)"
            + " ON CONFLICT (card_id, type) DO UPDATE SET enabled = EXCLUDED.enabled";

    private final DataSource dataSource;

    @Inject
    public JdbcNotificationRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public PageResult<CardNotification> findByCard(UUID cardId, boolean unreadOnly, int page, int size) {
        try (Connection connection = dataSource.getConnection()) {
            long total = count(connection, cardId, unreadOnly);
            List<CardNotification> items = new ArrayList<>();
            try (PreparedStatement statement = connection.prepareStatement(unreadOnly ? SELECT_UNREAD : SELECT_ALL)) {
                statement.setObject(1, cardId);
                statement.setInt(2, size);
                statement.setLong(3, (long) page * size);
                try (ResultSet rows = statement.executeQuery()) {
                    while (rows.next()) {
                        items.add(map(rows));
                    }
                }
            }
            return new PageResult<>(items, page, size, total);
        } catch (SQLException e) {
            throw new DataAccessException("No se pudo listar las notificaciones", e);
        }
    }

    @Override
    public Optional<CardNotification> findById(UUID id) {
        try (Connection connection = dataSource.getConnection();
                PreparedStatement statement = connection.prepareStatement(SELECT_BY_ID)) {
            statement.setObject(1, id);
            try (ResultSet rows = statement.executeQuery()) {
                return rows.next() ? Optional.of(map(rows)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new DataAccessException("No se pudo leer la notificación", e);
        }
    }

    @Override
    public void markRead(UUID id, Instant readAt) {
        try (Connection connection = dataSource.getConnection();
                PreparedStatement statement = connection.prepareStatement(UPDATE_READ)) {
            statement.setObject(1, OffsetDateTime.ofInstant(readAt, ZoneOffset.UTC));
            statement.setObject(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new DataAccessException("No se pudo marcar la notificación como leída", e);
        }
    }

    @Override
    public List<Preference> findPreferences(UUID cardId) {
        try (Connection connection = dataSource.getConnection();
                PreparedStatement statement = connection.prepareStatement(SELECT_PREFERENCES)) {
            statement.setObject(1, cardId);
            List<Preference> preferences = new ArrayList<>();
            try (ResultSet rows = statement.executeQuery()) {
                while (rows.next()) {
                    preferences.add(new Preference(NotificationType.valueOf(rows.getString("type")),
                            rows.getBoolean("enabled")));
                }
            }
            return preferences;
        } catch (SQLException e) {
            throw new DataAccessException("No se pudo leer las preferencias", e);
        }
    }

    @Override
    public void savePreferences(UUID cardId, List<Preference> preferences) {
        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement statement = connection.prepareStatement(UPSERT_PREFERENCE)) {
                for (Preference preference : preferences) {
                    statement.setObject(1, cardId);
                    statement.setString(2, preference.type().name());
                    statement.setBoolean(3, preference.enabled());
                    statement.addBatch();
                }
                statement.executeBatch();
                connection.commit();
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        } catch (SQLException e) {
            throw new DataAccessException("No se pudo guardar las preferencias", e);
        }
    }

    private static long count(Connection connection, UUID cardId, boolean unreadOnly) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(unreadOnly ? COUNT_UNREAD : COUNT_ALL)) {
            statement.setObject(1, cardId);
            try (ResultSet rows = statement.executeQuery()) {
                return rows.next() ? rows.getLong(1) : 0L;
            }
        }
    }

    private static CardNotification map(ResultSet rows) throws SQLException {
        OffsetDateTime readAt = rows.getObject("read_at", OffsetDateTime.class);
        OffsetDateTime createdAt = rows.getObject("created_at", OffsetDateTime.class);
        return new CardNotification(
                rows.getObject("id", UUID.class),
                rows.getObject("card_id", UUID.class),
                rows.getString("card_last4"),
                NotificationType.valueOf(rows.getString("type")),
                rows.getString("title"),
                rows.getString("message"),
                rows.getBigDecimal("amount"),
                readAt == null ? null : readAt.toInstant(),
                createdAt.toInstant());
    }
}

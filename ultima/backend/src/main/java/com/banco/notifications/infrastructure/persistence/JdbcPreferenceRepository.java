package com.banco.notifications.infrastructure.persistence;

import com.banco.notifications.domain.Channel;
import com.banco.notifications.domain.NotificationPreference;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PreferenceRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcPreferenceRepository implements PreferenceRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcPreferenceRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<NotificationPreference> findByCard(UUID cardId) {
        return jdbc.query(
                "SELECT type, channel, enabled FROM notification_preference WHERE card_id = :cardId",
                Map.of("cardId", cardId),
                (rs, i) -> new NotificationPreference(NotificationType.valueOf(rs.getString("type")),
                        Channel.valueOf(rs.getString("channel")), rs.getBoolean("enabled")));
    }

    @Override
    public void saveAll(UUID cardId, List<NotificationPreference> preferences) {
        SqlParameterSource[] batch = preferences.stream()
                .map(p -> new MapSqlParameterSource()
                        .addValue("cardId", cardId)
                        .addValue("type", p.type().name())
                        .addValue("channel", p.channel().name())
                        .addValue("enabled", p.enabled()))
                .toArray(SqlParameterSource[]::new);
        jdbc.batchUpdate(
                "INSERT INTO notification_preference (card_id, type, channel, enabled) "
                        + "VALUES (:cardId, :type, :channel, :enabled) "
                        + "ON CONFLICT (card_id, type, channel) DO UPDATE SET enabled = EXCLUDED.enabled",
                batch);
    }
}

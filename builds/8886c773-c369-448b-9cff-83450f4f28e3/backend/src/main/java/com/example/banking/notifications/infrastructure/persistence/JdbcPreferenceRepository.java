package com.example.banking.notifications.infrastructure.persistence;

import com.example.banking.notifications.application.ports.PreferenceRepository;
import com.example.banking.notifications.domain.Channel;
import com.example.banking.notifications.domain.NotificationType;
import com.example.banking.notifications.domain.Preference;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcPreferenceRepository implements PreferenceRepository {

    private static final String SELECT = "SELECT account_id, type, channel, enabled, threshold_amount "
            + "FROM notification_preference WHERE account_id = ? ORDER BY type, channel";
    private static final String DELETE = "DELETE FROM notification_preference WHERE account_id = ?";
    private static final String INSERT = "INSERT INTO notification_preference "
            + "(account_id, type, channel, enabled, threshold_amount) VALUES (?, ?, ?, ?, ?)";

    private final DataSource dataSource;

    public JdbcPreferenceRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Preference> findByAccount(String accountId) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SELECT)) {
            ps.setString(1, accountId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Preference> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(new Preference(
                            rs.getString("account_id"),
                            NotificationType.valueOf(rs.getString("type")),
                            Channel.valueOf(rs.getString("channel")),
                            rs.getBoolean("enabled"),
                            rs.getBigDecimal("threshold_amount")));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando preferencias", e);
        }
    }

    @Override
    public void replaceAll(String accountId, List<Preference> preferences) {
        try (Connection c = dataSource.getConnection()) {
            c.setAutoCommit(false);
            try {
                try (PreparedStatement del = c.prepareStatement(DELETE)) {
                    del.setString(1, accountId);
                    del.executeUpdate();
                }
                try (PreparedStatement ins = c.prepareStatement(INSERT)) {
                    for (Preference p : preferences) {
                        ins.setString(1, p.accountId());
                        ins.setString(2, p.type().name());
                        ins.setString(3, p.channel().name());
                        ins.setBoolean(4, p.enabled());
                        ins.setBigDecimal(5, p.thresholdAmount());
                        ins.addBatch();
                    }
                    ins.executeBatch();
                }
                c.commit();
            } catch (SQLException e) {
                c.rollback();
                throw e;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error guardando preferencias", e);
        }
    }
}

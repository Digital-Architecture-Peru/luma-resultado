package com.example.banking.notifications.infrastructure.persistence;

import com.example.banking.notifications.application.ports.AccountOwnership;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcAccountOwnership implements AccountOwnership {

    private static final String SQL = "SELECT 1 FROM account WHERE id = ? AND customer_id = ?";

    private final DataSource dataSource;

    public JdbcAccountOwnership(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public boolean isOwner(String customerId, String accountId) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(SQL)) {
            ps.setString(1, accountId);
            ps.setString(2, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error verificando la titularidad de la cuenta", e);
        }
    }
}

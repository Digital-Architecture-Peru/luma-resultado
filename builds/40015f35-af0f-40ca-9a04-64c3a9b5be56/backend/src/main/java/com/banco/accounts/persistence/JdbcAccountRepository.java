package com.banco.accounts.persistence;

import com.banco.accounts.domain.Account;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcAccountRepository implements AccountRepository {

    private static final String COLUMNS =
            "id, customer_id, account_number, type, currency, balance, status, updated_at";

    private final DataSource dataSource;

    public JdbcAccountRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Account> findByCustomer(String customerId, int limit, int offset) {
        String sql = "SELECT " + COLUMNS
                + " FROM account WHERE customer_id = ? ORDER BY account_number LIMIT ? OFFSET ?";
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, customerId);
            ps.setInt(2, limit);
            ps.setInt(3, offset);
            try (ResultSet rs = ps.executeQuery()) {
                List<Account> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("No se pudo consultar las cuentas", e);
        }
    }

    @Override
    public long countByCustomer(String customerId) {
        String sql = "SELECT COUNT(*) FROM account WHERE customer_id = ?";
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getLong(1) : 0L;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("No se pudo contar las cuentas", e);
        }
    }

    @Override
    public Optional<Account> findByIdAndCustomer(UUID id, String customerId) {
        String sql = "SELECT " + COLUMNS + " FROM account WHERE id = ? AND customer_id = ?";
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setObject(1, id);
            ps.setString(2, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("No se pudo consultar la cuenta", e);
        }
    }

    private static Account map(ResultSet rs) throws SQLException {
        BigDecimal balance = rs.getBigDecimal("balance");
        return new Account(
                rs.getObject("id", UUID.class),
                rs.getString("customer_id"),
                rs.getString("account_number"),
                rs.getString("type"),
                rs.getString("currency"),
                balance,
                rs.getString("status"),
                rs.getObject("updated_at", OffsetDateTime.class).toInstant());
    }
}

package com.banco.cuentas.persistence.pg;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.persistence.AccountRepository;
import io.agroal.api.AgroalDataSource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** Implementacion PostgreSQL con JDBC y sentencias parametrizadas. */
@ApplicationScoped
public class PgAccountRepository implements AccountRepository {

    private static final String COLUMNS = "id, number_masked, owner_id, currency, balance";

    private final AgroalDataSource dataSource;

    @Inject
    public PgAccountRepository(AgroalDataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Account> findByOwner(String ownerId) {
        String sql = "SELECT " + COLUMNS + " FROM account WHERE owner_id = ? ORDER BY id";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, ownerId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Account> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando cuentas", e);
        }
    }

    @Override
    public Optional<Account> findById(long id) {
        return queryOne("SELECT " + COLUMNS + " FROM account WHERE id = ?", id);
    }

    @Override
    public Optional<Account> findByIdForUpdate(long id) {
        return queryOne("SELECT " + COLUMNS + " FROM account WHERE id = ? FOR UPDATE", id);
    }

    @Override
    public void updateBalance(long id, BigDecimal newBalance) {
        String sql = "UPDATE account SET balance = ?, version = version + 1 WHERE id = ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setBigDecimal(1, newBalance);
            ps.setLong(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error actualizando saldo", e);
        }
    }

    private Optional<Account> queryOne(String sql, long id) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando cuenta", e);
        }
    }

    private static Account map(ResultSet rs) throws SQLException {
        return new Account(rs.getLong("id"), rs.getString("number_masked"), rs.getString("owner_id"),
                rs.getString("currency").trim(), rs.getBigDecimal("balance"));
    }
}

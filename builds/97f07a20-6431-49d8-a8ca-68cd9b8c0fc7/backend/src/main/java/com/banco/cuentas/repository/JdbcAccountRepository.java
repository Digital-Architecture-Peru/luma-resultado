package com.banco.cuentas.repository;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.MovementType;
import com.banco.cuentas.domain.TransferReceipt;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
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

/** Adaptador JDBC para PostgreSQL. Todas las consultas están parametrizadas. */
@ApplicationScoped
public class JdbcAccountRepository implements AccountRepository {

    private static final String ACCOUNT_COLUMNS = "id, number, holder_alias, currency, balance";

    private final DataSource dataSource;

    public JdbcAccountRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Account> findAll() {
        String sql = "SELECT " + ACCOUNT_COLUMNS + " FROM account ORDER BY id";
        return queryAccounts(sql, null);
    }

    @Override
    public boolean accountExists(long accountId) {
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement("SELECT 1 FROM account WHERE id = ?")) {
            ps.setLong(1, accountId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando la cuenta", e);
        }
    }

    @Override
    public List<Account> lockByIds(List<Long> accountIds) {
        String sql = "SELECT " + ACCOUNT_COLUMNS
                + " FROM account WHERE id = ANY (?) ORDER BY id ASC FOR UPDATE";
        return queryAccounts(sql, accountIds.toArray(new Long[0]));
    }

    private List<Account> queryAccounts(String sql, Long[] ids) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            if (ids != null) {
                ps.setArray(1, c.createArrayOf("bigint", ids));
            }
            try (ResultSet rs = ps.executeQuery()) {
                List<Account> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(new Account(rs.getLong("id"), rs.getString("number"),
                            rs.getString("holder_alias"), rs.getString("currency"),
                            rs.getBigDecimal("balance")));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando cuentas", e);
        }
    }

    @Override
    public void updateBalance(long accountId, BigDecimal newBalance) {
        execute("UPDATE account SET balance = ?, version = version + 1 WHERE id = ?", ps -> {
            ps.setBigDecimal(1, newBalance);
            ps.setLong(2, accountId);
        });
    }

    @Override
    public Optional<TransferReceipt> findTransferByKey(String idempotencyKey) {
        String sql = "SELECT id, idempotency_key, source_id, target_id, amount, currency, description, created_at"
                + " FROM transfer WHERE idempotency_key = ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, idempotencyKey);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                return Optional.of(new TransferReceipt(rs.getObject("id", UUID.class),
                        rs.getString("idempotency_key"), rs.getLong("source_id"), rs.getLong("target_id"),
                        rs.getBigDecimal("amount"), rs.getString("currency"), rs.getString("description"),
                        rs.getObject("created_at", OffsetDateTime.class).toInstant()));
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando la transferencia", e);
        }
    }

    @Override
    public void insertTransfer(TransferReceipt r) {
        execute("INSERT INTO transfer (id, idempotency_key, source_id, target_id, amount, currency,"
                + " description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", ps -> {
                    ps.setObject(1, r.id());
                    ps.setString(2, r.idempotencyKey());
                    ps.setLong(3, r.sourceAccountId());
                    ps.setLong(4, r.targetAccountId());
                    ps.setBigDecimal(5, r.amount());
                    ps.setString(6, r.currency());
                    ps.setString(7, r.description());
                    ps.setObject(8, toUtc(r.createdAt()));
                });
    }

    @Override
    public void insertMovement(long accountId, UUID transferId, MovementType type, BigDecimal amount,
            Instant at) {
        execute("INSERT INTO movement (account_id, transfer_id, type, amount, created_at)"
                + " VALUES (?, ?, ?, ?, ?)", ps -> {
                    ps.setLong(1, accountId);
                    ps.setObject(2, transferId);
                    ps.setString(3, type.name());
                    ps.setBigDecimal(4, amount);
                    ps.setObject(5, toUtc(at));
                });
    }

    @Override
    public List<Movement> findMovements(long accountId) {
        String sql = "SELECT id, account_id, transfer_id, type, amount, created_at FROM movement"
                + " WHERE account_id = ? ORDER BY created_at DESC, id DESC LIMIT 50";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, accountId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Movement> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(new Movement(rs.getLong("id"), rs.getLong("account_id"),
                            rs.getObject("transfer_id", UUID.class), MovementType.valueOf(rs.getString("type")),
                            rs.getBigDecimal("amount"),
                            rs.getObject("created_at", OffsetDateTime.class).toInstant()));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando movimientos", e);
        }
    }

    private static OffsetDateTime toUtc(Instant instant) {
        return instant.atOffset(ZoneOffset.UTC);
    }

    @FunctionalInterface
    private interface Binder {
        void bind(PreparedStatement ps) throws SQLException;
    }

    private void execute(String sql, Binder binder) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            binder.bind(ps);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error escribiendo en la base de datos", e);
        }
    }
}

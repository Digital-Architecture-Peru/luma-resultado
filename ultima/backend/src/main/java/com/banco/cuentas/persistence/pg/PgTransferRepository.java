package com.banco.cuentas.persistence.pg;

import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.Transfer;
import com.banco.cuentas.persistence.TransferRepository;
import io.agroal.api.AgroalDataSource;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Implementacion PostgreSQL con JDBC y sentencias parametrizadas. */
@ApplicationScoped
public class PgTransferRepository implements TransferRepository {

    private final AgroalDataSource dataSource;

    @Inject
    public PgTransferRepository(AgroalDataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<Transfer> findByIdempotencyKey(String key) {
        String sql = "SELECT id, idempotency_key, source_id, target_id, amount, currency, description, status, created_at "
                + "FROM transfer WHERE idempotency_key = ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, key);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                return Optional.of(new Transfer(rs.getObject("id", UUID.class), rs.getString("idempotency_key"),
                        rs.getLong("source_id"), rs.getLong("target_id"), rs.getBigDecimal("amount"),
                        rs.getString("currency").trim(), rs.getString("description"), rs.getString("status"),
                        rs.getTimestamp("created_at").toInstant()));
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando transferencia", e);
        }
    }

    @Override
    public void insert(Transfer t) {
        String sql = "INSERT INTO transfer (id, idempotency_key, source_id, target_id, amount, currency, description, status, created_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setObject(1, t.id());
            ps.setString(2, t.idempotencyKey());
            ps.setLong(3, t.sourceId());
            ps.setLong(4, t.targetId());
            ps.setBigDecimal(5, t.amount());
            ps.setString(6, t.currency());
            ps.setString(7, t.description());
            ps.setString(8, t.status());
            ps.setTimestamp(9, Timestamp.from(t.createdAt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error guardando transferencia", e);
        }
    }

    @Override
    public void insertMovement(Movement m) {
        String sql = "INSERT INTO movement (account_id, transfer_id, type, amount, created_at) VALUES (?, ?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, m.accountId());
            ps.setObject(2, m.transferId());
            ps.setString(3, m.type().name());
            ps.setBigDecimal(4, m.amount());
            ps.setTimestamp(5, Timestamp.from(m.createdAt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error guardando movimiento", e);
        }
    }

    @Override
    public List<Movement> findMovements(long accountId, int page, int size) {
        String sql = "SELECT id, account_id, transfer_id, type, amount, created_at FROM movement "
                + "WHERE account_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, accountId);
            ps.setInt(2, size);
            ps.setInt(3, page * size);
            try (ResultSet rs = ps.executeQuery()) {
                List<Movement> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(new Movement(rs.getLong("id"), rs.getLong("account_id"),
                            rs.getObject("transfer_id", UUID.class), Movement.Type.valueOf(rs.getString("type")),
                            rs.getBigDecimal("amount"), rs.getTimestamp("created_at").toInstant()));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando movimientos", e);
        }
    }
}

package com.banco.cards.repository;

import com.banco.cards.domain.CardTransaction;
import com.banco.cards.domain.CardTransaction.Status;
import com.banco.cards.domain.TransactionType;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcCardTransactionRepository implements CardTransactionRepository {

    private static final String COLUMNS =
            "id, card_id, type, amount, currency, description, status, idempotency_key, created_at";
    private static final String INSERT = "INSERT INTO card_transaction (" + COLUMNS
            + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String BY_KEY =
            "SELECT " + COLUMNS + " FROM card_transaction WHERE idempotency_key = ?";
    private static final String RECENT = "SELECT " + COLUMNS
            + " FROM card_transaction WHERE card_id = ? ORDER BY created_at DESC LIMIT ?";

    private final DataSource dataSource;

    public JdbcCardTransactionRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(CardTransaction t) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(INSERT)) {
            ps.setObject(1, t.id());
            ps.setObject(2, t.cardId());
            ps.setString(3, t.type().name());
            ps.setBigDecimal(4, t.amount());
            ps.setString(5, t.currency());
            ps.setString(6, t.description());
            ps.setString(7, t.status().name());
            ps.setString(8, t.idempotencyKey());
            ps.setTimestamp(9, Timestamp.from(t.createdAt()));
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException("Error guardando la transacción", e);
        }
    }

    @Override
    public Optional<CardTransaction> findByIdempotencyKey(String key) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(BY_KEY)) {
            ps.setString(1, key);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando la clave de idempotencia", e);
        }
    }

    @Override
    public List<CardTransaction> findRecentByCard(UUID cardId, int limit) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(RECENT)) {
            ps.setObject(1, cardId);
            ps.setInt(2, limit);
            try (ResultSet rs = ps.executeQuery()) {
                List<CardTransaction> result = new ArrayList<>();
                while (rs.next()) {
                    result.add(map(rs));
                }
                return result;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error listando transacciones", e);
        }
    }

    private static CardTransaction map(ResultSet rs) throws SQLException {
        return new CardTransaction(
                rs.getObject("id", UUID.class),
                rs.getObject("card_id", UUID.class),
                TransactionType.valueOf(rs.getString("type")),
                rs.getBigDecimal("amount"),
                rs.getString("currency"),
                rs.getString("description"),
                Status.valueOf(rs.getString("status")),
                rs.getString("idempotency_key"),
                rs.getTimestamp("created_at").toInstant());
    }
}

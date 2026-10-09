package com.banco.cards.repository;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.Card.CardStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

@ApplicationScoped
public class JdbcCardRepository implements CardRepository {

    private static final String FIND_BY_ID =
            "SELECT id, masked_pan, status, credit_limit, available_balance, version FROM card WHERE id = ?";
    private static final String UPDATE_BALANCE =
            "UPDATE card SET available_balance = ?, version = version + 1 WHERE id = ? AND version = ?";

    private final DataSource dataSource;

    public JdbcCardRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Optional<Card> findById(UUID id) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(FIND_BY_ID)) {
            ps.setObject(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                return Optional.of(new Card(
                        rs.getObject("id", UUID.class),
                        rs.getString("masked_pan"),
                        CardStatus.valueOf(rs.getString("status")),
                        rs.getBigDecimal("credit_limit"),
                        rs.getBigDecimal("available_balance"),
                        rs.getLong("version")));
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando la tarjeta", e);
        }
    }

    @Override
    public boolean updateBalance(UUID id, BigDecimal newBalance, long expectedVersion) {
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(UPDATE_BALANCE)) {
            ps.setBigDecimal(1, newBalance);
            ps.setObject(2, id);
            ps.setLong(3, expectedVersion);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            throw new IllegalStateException("Error actualizando el saldo", e);
        }
    }
}

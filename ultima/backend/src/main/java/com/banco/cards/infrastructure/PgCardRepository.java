package com.banco.cards.infrastructure;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardRepository;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import jakarta.enterprise.context.ApplicationScoped;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.sql.DataSource;

/** Adaptador PostgreSQL con SQL parametrizado. */
@ApplicationScoped
public class PgCardRepository implements CardRepository {

    private static final String COLUMNS =
            "id, customer_id, last4, brand, card_type, status, holder_name, "
                    + "credit_limit, available_balance, currency";

    private static final String SELECT_BY_CUSTOMER =
            "SELECT " + COLUMNS + " FROM card WHERE customer_id = ? ORDER BY created_at, id";

    private static final String SELECT_BY_ID_AND_CUSTOMER =
            "SELECT " + COLUMNS + " FROM card WHERE id = ? AND customer_id = ?";

    private final DataSource dataSource;

    public PgCardRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Card> findByCustomer(UUID customerId) {
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(SELECT_BY_CUSTOMER)) {
            ps.setObject(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Card> cards = new ArrayList<>();
                while (rs.next()) {
                    cards.add(map(rs));
                }
                return cards;
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando tarjetas", e);
        }
    }

    @Override
    public Optional<Card> findByIdAndCustomer(UUID cardId, UUID customerId) {
        try (Connection con = dataSource.getConnection();
                PreparedStatement ps = con.prepareStatement(SELECT_BY_ID_AND_CUSTOMER)) {
            ps.setObject(1, cardId);
            ps.setObject(2, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new IllegalStateException("Error consultando tarjeta", e);
        }
    }

    private static Card map(ResultSet rs) throws SQLException {
        return new Card(
                rs.getObject("id", UUID.class),
                rs.getObject("customer_id", UUID.class),
                rs.getString("last4"),
                rs.getString("brand"),
                CardType.valueOf(rs.getString("card_type")),
                CardStatus.valueOf(rs.getString("status")),
                rs.getString("holder_name"),
                rs.getBigDecimal("credit_limit"),
                rs.getBigDecimal("available_balance"),
                rs.getString("currency"));
    }
}

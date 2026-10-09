package com.banco.notifications.infrastructure.persistence;

import com.banco.notifications.domain.Card;
import com.banco.notifications.domain.CardRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcCardRepository implements CardRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCardRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findByCustomer(String customerId) {
        return jdbc.query(
                "SELECT id, brand, alias, pan_last4 FROM card WHERE customer_id = :customerId ORDER BY alias",
                Map.of("customerId", customerId),
                (rs, i) -> new Card(rs.getObject("id", UUID.class), rs.getString("brand"),
                        rs.getString("alias"), rs.getString("pan_last4")));
    }

    @Override
    public boolean existsForCustomer(UUID cardId, String customerId) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM card WHERE id = :cardId AND customer_id = :customerId",
                Map.of("cardId", cardId, "customerId", customerId), Integer.class);
        return count != null && count > 0;
    }
}

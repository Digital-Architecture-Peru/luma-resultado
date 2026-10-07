package com.bank.cards.adapter;

import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardStatus;
import com.bank.cards.domain.CardType;
import com.bank.cards.port.CardRepository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcCardRepository implements CardRepository {

    private static final String COLUMNS =
            "id, customer_id, alias, last4, type, status, credit_limit, available_balance, currency, expiry_date";

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCardRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findByCustomer(String customerId) {
        String sql = "SELECT " + COLUMNS + " FROM card WHERE customer_id = :customerId ORDER BY alias";
        return jdbc.query(sql, new MapSqlParameterSource("customerId", customerId), this::mapRow);
    }

    @Override
    public Optional<Card> findByIdAndCustomer(UUID cardId, String customerId) {
        String sql = "SELECT " + COLUMNS + " FROM card WHERE id = :id AND customer_id = :customerId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", cardId)
                .addValue("customerId", customerId);
        return jdbc.query(sql, params, this::mapRow).stream().findFirst();
    }

    private Card mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Card(
                rs.getObject("id", UUID.class),
                rs.getString("customer_id"),
                rs.getString("alias"),
                rs.getString("last4"),
                CardType.valueOf(rs.getString("type")),
                CardStatus.valueOf(rs.getString("status")),
                rs.getBigDecimal("credit_limit"),
                rs.getBigDecimal("available_balance"),
                rs.getString("currency"),
                rs.getObject("expiry_date", LocalDate.class));
    }
}

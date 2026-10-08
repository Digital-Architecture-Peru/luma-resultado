package com.banco.cards.persistence;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcCardRepository implements CardRepository {

    private static final String SELECT_COLUMNS =
            "SELECT id, customer_id, pan_last4, masked_pan, brand, card_type, status, "
                    + "credit_limit, available_balance, currency, created_at FROM card ";

    private static final String FIND_BY_CUSTOMER =
            SELECT_COLUMNS + "WHERE customer_id = :customerId ORDER BY created_at, id";

    private static final String FIND_BY_ID_AND_CUSTOMER =
            SELECT_COLUMNS + "WHERE id = :id AND customer_id = :customerId";

    private static final RowMapper<Card> CARD_MAPPER = JdbcCardRepository::mapRow;

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCardRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findByCustomerId(String customerId) {
        var params = new MapSqlParameterSource("customerId", customerId);
        return jdbc.query(FIND_BY_CUSTOMER, params, CARD_MAPPER);
    }

    @Override
    public Optional<Card> findByIdAndCustomerId(UUID cardId, String customerId) {
        var params = new MapSqlParameterSource()
                .addValue("id", cardId)
                .addValue("customerId", customerId);
        return jdbc.query(FIND_BY_ID_AND_CUSTOMER, params, CARD_MAPPER).stream().findFirst();
    }

    private static Card mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Card(
                rs.getObject("id", UUID.class),
                rs.getString("customer_id"),
                rs.getString("pan_last4"),
                rs.getString("masked_pan"),
                rs.getString("brand"),
                rs.getString("card_type"),
                CardStatus.valueOf(rs.getString("status")),
                rs.getBigDecimal("credit_limit"),
                rs.getBigDecimal("available_balance"),
                rs.getString("currency"),
                rs.getTimestamp("created_at").toInstant());
    }
}

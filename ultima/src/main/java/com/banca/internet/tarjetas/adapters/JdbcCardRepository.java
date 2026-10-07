package com.banca.internet.tarjetas.adapters;

import com.banca.internet.tarjetas.atoms.Card;
import com.banca.internet.tarjetas.atoms.CardStatus;
import com.banca.internet.tarjetas.atoms.MaskedPan;
import com.banca.internet.tarjetas.molecules.CardRepository;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

/** Adaptador PostgreSQL con consultas parametrizadas. */
@Repository
public class JdbcCardRepository implements CardRepository {

    private static final String COLUMNS =
            "id, customer_id, pan_last4, brand, card_type, status, currency, credit_limit, available_balance, expiry_date";

    private static final RowMapper<Card> MAPPER = JdbcCardRepository::mapRow;

    private final JdbcTemplate jdbc;

    public JdbcCardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findByCustomer(String customerId, Optional<CardStatus> status, int limit, int offset) {
        String sql = "SELECT " + COLUMNS + " FROM cards WHERE customer_id = ? "
                + "AND (CAST(? AS VARCHAR) IS NULL OR status = ?) ORDER BY id LIMIT ? OFFSET ?";
        String s = status.map(Enum::name).orElse(null);
        return jdbc.query(sql, MAPPER, customerId, s, s, limit, offset);
    }

    @Override
    public long countByCustomer(String customerId, Optional<CardStatus> status) {
        String sql = "SELECT COUNT(*) FROM cards WHERE customer_id = ? "
                + "AND (CAST(? AS VARCHAR) IS NULL OR status = ?)";
        String s = status.map(Enum::name).orElse(null);
        Long total = jdbc.queryForObject(sql, Long.class, customerId, s, s);
        return total == null ? 0L : total;
    }

    @Override
    public Optional<Card> findByIdAndCustomer(long id, String customerId) {
        String sql = "SELECT " + COLUMNS + " FROM cards WHERE id = ? AND customer_id = ?";
        return jdbc.query(sql, MAPPER, id, customerId).stream().findFirst();
    }

    private static Card mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Card(
                rs.getLong("id"),
                rs.getString("customer_id"),
                new MaskedPan(rs.getString("pan_last4")),
                rs.getString("brand"),
                rs.getString("card_type"),
                CardStatus.valueOf(rs.getString("status")),
                rs.getString("currency"),
                rs.getBigDecimal("credit_limit"),
                rs.getBigDecimal("available_balance"),
                rs.getDate("expiry_date").toLocalDate());
    }
}

package com.bank.cards.adapters.out.persistence;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.bank.cards.application.port.CardTransactionRepository;
import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardTransaction;
import com.bank.cards.domain.TransactionStatus;

@Repository
public class JdbcCardTransactionRepository implements CardTransactionRepository {

    private static final String CARD_COLUMNS =
            "id, customer_id, masked_pan, brand, status, credit_limit, available_balance";
    private static final String TX_COLUMNS =
            "id, card_id, amount, currency, source_account_id, description, status, idempotency_key, created_at";

    private static final RowMapper<Card> CARD_MAPPER = (rs, i) -> new Card(
            rs.getObject("id", UUID.class),
            rs.getString("customer_id"),
            rs.getString("masked_pan"),
            rs.getString("brand"),
            rs.getString("status"),
            rs.getBigDecimal("credit_limit"),
            rs.getBigDecimal("available_balance"));

    private static final RowMapper<CardTransaction> TX_MAPPER = (rs, i) -> new CardTransaction(
            rs.getObject("id", UUID.class),
            rs.getObject("card_id", UUID.class),
            rs.getBigDecimal("amount"),
            rs.getString("currency").trim(),
            rs.getString("source_account_id"),
            rs.getString("description"),
            TransactionStatus.valueOf(rs.getString("status")),
            rs.getString("idempotency_key"),
            rs.getTimestamp("created_at").toInstant());

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCardTransactionRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findCardsByCustomer(String customerId) {
        return jdbc.query("SELECT " + CARD_COLUMNS + " FROM card WHERE customer_id = :customerId ORDER BY masked_pan",
                new MapSqlParameterSource("customerId", customerId), CARD_MAPPER);
    }

    @Override
    public Optional<Card> findCard(UUID cardId) {
        return jdbc.query("SELECT " + CARD_COLUMNS + " FROM card WHERE id = :id",
                new MapSqlParameterSource("id", cardId), CARD_MAPPER).stream().findFirst();
    }

    @Override
    public Optional<CardTransaction> findByIdempotencyKey(String idempotencyKey) {
        return jdbc.query("SELECT " + TX_COLUMNS + " FROM card_transaction WHERE idempotency_key = :key",
                new MapSqlParameterSource("key", idempotencyKey), TX_MAPPER).stream().findFirst();
    }

    @Override
    public boolean reserveFunds(UUID cardId, BigDecimal amount) {
        int updated = jdbc.update(
                "UPDATE card SET available_balance = available_balance - :amount "
                        + "WHERE id = :id AND available_balance >= :amount",
                new MapSqlParameterSource("id", cardId).addValue("amount", amount));
        return updated == 1;
    }

    @Override
    public void save(CardTransaction tx) {
        jdbc.update("INSERT INTO card_transaction (" + TX_COLUMNS + ") VALUES "
                        + "(:id, :cardId, :amount, :currency, :source, :description, :status, :key, :createdAt)",
                new MapSqlParameterSource()
                        .addValue("id", tx.id())
                        .addValue("cardId", tx.cardId())
                        .addValue("amount", tx.amount())
                        .addValue("currency", tx.currency())
                        .addValue("source", tx.sourceAccountId())
                        .addValue("description", tx.description())
                        .addValue("status", tx.status().name())
                        .addValue("key", tx.idempotencyKey())
                        .addValue("createdAt", Timestamp.from(tx.createdAt())));
    }

    @Override
    public List<CardTransaction> findByCard(UUID cardId, int page, int size) {
        return jdbc.query("SELECT " + TX_COLUMNS + " FROM card_transaction WHERE card_id = :cardId "
                        + "ORDER BY created_at DESC LIMIT :size OFFSET :offset",
                new MapSqlParameterSource("cardId", cardId)
                        .addValue("size", size)
                        .addValue("offset", (long) page * size),
                TX_MAPPER);
    }

    @Override
    public long countByCard(UUID cardId) {
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM card_transaction WHERE card_id = :cardId",
                new MapSqlParameterSource("cardId", cardId), Long.class);
        return total == null ? 0L : total;
    }
}

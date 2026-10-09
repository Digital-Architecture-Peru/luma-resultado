package com.example.cards.adapter;

import com.example.cards.domain.Account;
import com.example.cards.domain.Card;
import com.example.cards.domain.CardTransaction;
import com.example.cards.port.CardRepository;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

/** Acceso a PostgreSQL. Todas las consultas usan parámetros con nombre. */
@Repository
public class JdbcCardRepository implements CardRepository {

    private static final RowMapper<Card> CARD_MAPPER = (rs, i) -> new Card(
            rs.getString("id"),
            rs.getString("customer_id"),
            rs.getString("last4"),
            rs.getString("brand"),
            rs.getBigDecimal("credit_limit"),
            rs.getBigDecimal("balance"),
            rs.getLong("version"));

    private static final RowMapper<Account> ACCOUNT_MAPPER = (rs, i) -> new Account(
            rs.getString("id"),
            rs.getString("customer_id"),
            rs.getString("alias"),
            rs.getBigDecimal("balance"),
            rs.getLong("version"));

    private static final RowMapper<CardTransaction> TX_MAPPER = (rs, i) -> new CardTransaction(
            rs.getString("id"),
            rs.getString("card_id"),
            rs.getString("type"),
            rs.getBigDecimal("amount"),
            rs.getString("status"),
            rs.getString("idempotency_key"),
            rs.getTimestamp("created_at").toInstant());

    private final NamedParameterJdbcTemplate jdbc;

    public JdbcCardRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public List<Card> findCardsByCustomer(String customerId) {
        return jdbc.query(
                "SELECT id, customer_id, last4, brand, credit_limit, balance, version "
                        + "FROM card WHERE customer_id = :customerId ORDER BY id",
                new MapSqlParameterSource("customerId", customerId), CARD_MAPPER);
    }

    @Override
    public Optional<Card> findCard(String customerId, String cardId) {
        return jdbc.query(
                "SELECT id, customer_id, last4, brand, credit_limit, balance, version "
                        + "FROM card WHERE id = :cardId AND customer_id = :customerId",
                new MapSqlParameterSource("cardId", cardId).addValue("customerId", customerId),
                CARD_MAPPER).stream().findFirst();
    }

    @Override
    public List<Account> findAccountsByCustomer(String customerId) {
        return jdbc.query(
                "SELECT id, customer_id, alias, balance, version "
                        + "FROM account WHERE customer_id = :customerId ORDER BY id",
                new MapSqlParameterSource("customerId", customerId), ACCOUNT_MAPPER);
    }

    @Override
    public Optional<Account> findAccount(String customerId, String accountId) {
        return jdbc.query(
                "SELECT id, customer_id, alias, balance, version "
                        + "FROM account WHERE id = :accountId AND customer_id = :customerId",
                new MapSqlParameterSource("accountId", accountId).addValue("customerId", customerId),
                ACCOUNT_MAPPER).stream().findFirst();
    }

    @Override
    public Optional<CardTransaction> findByIdempotencyKey(String idempotencyKey) {
        return jdbc.query(
                "SELECT id, card_id, type, amount, status, idempotency_key, created_at "
                        + "FROM card_transaction WHERE idempotency_key = :key",
                new MapSqlParameterSource("key", idempotencyKey), TX_MAPPER).stream().findFirst();
    }

    @Override
    public List<CardTransaction> findTransactions(String cardId, int page, int size) {
        return jdbc.query(
                "SELECT id, card_id, type, amount, status, idempotency_key, created_at "
                        + "FROM card_transaction WHERE card_id = :cardId "
                        + "ORDER BY created_at DESC, id LIMIT :size OFFSET :offset",
                new MapSqlParameterSource("cardId", cardId)
                        .addValue("size", size)
                        .addValue("offset", (long) page * size),
                TX_MAPPER);
    }

    @Override
    public long countTransactions(String cardId) {
        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM card_transaction WHERE card_id = :cardId",
                new MapSqlParameterSource("cardId", cardId), Long.class);
        return total == null ? 0L : total;
    }

    @Override
    public boolean debitAccount(String accountId, BigDecimal amount, long expectedVersion) {
        return jdbc.update(
                "UPDATE account SET balance = balance - :amount, version = version + 1 "
                        + "WHERE id = :id AND version = :version AND balance >= :amount",
                new MapSqlParameterSource("amount", amount)
                        .addValue("id", accountId)
                        .addValue("version", expectedVersion)) == 1;
    }

    @Override
    public boolean reduceCardBalance(String cardId, BigDecimal amount, long expectedVersion) {
        return jdbc.update(
                "UPDATE card SET balance = balance - :amount, version = version + 1 "
                        + "WHERE id = :id AND version = :version AND balance >= :amount",
                new MapSqlParameterSource("amount", amount)
                        .addValue("id", cardId)
                        .addValue("version", expectedVersion)) == 1;
    }

    @Override
    public CardTransaction saveTransaction(CardTransaction tx) {
        jdbc.update(
                "INSERT INTO card_transaction (id, card_id, type, amount, status, idempotency_key, created_at) "
                        + "VALUES (:id, :cardId, :type, :amount, :status, :key, :createdAt)",
                new MapSqlParameterSource("id", tx.id())
                        .addValue("cardId", tx.cardId())
                        .addValue("type", tx.type())
                        .addValue("amount", tx.amount())
                        .addValue("status", tx.status())
                        .addValue("key", tx.idempotencyKey())
                        .addValue("createdAt", Timestamp.from(tx.createdAt())));
        return tx;
    }
}

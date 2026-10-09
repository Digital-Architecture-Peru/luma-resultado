package com.example.cards.port;

import com.example.cards.domain.Account;
import com.example.cards.domain.Card;
import com.example.cards.domain.CardTransaction;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/** Puerto de persistencia. Las operaciones con versión implementan bloqueo optimista. */
public interface CardRepository {

    List<Card> findCardsByCustomer(String customerId);

    Optional<Card> findCard(String customerId, String cardId);

    List<Account> findAccountsByCustomer(String customerId);

    Optional<Account> findAccount(String customerId, String accountId);

    Optional<CardTransaction> findByIdempotencyKey(String idempotencyKey);

    List<CardTransaction> findTransactions(String cardId, int page, int size);

    long countTransactions(String cardId);

    /** @return true si se actualizó exactamente una fila con la versión esperada. */
    boolean debitAccount(String accountId, BigDecimal amount, long expectedVersion);

    /** @return true si se actualizó exactamente una fila con la versión esperada. */
    boolean reduceCardBalance(String cardId, BigDecimal amount, long expectedVersion);

    CardTransaction saveTransaction(CardTransaction transaction);
}

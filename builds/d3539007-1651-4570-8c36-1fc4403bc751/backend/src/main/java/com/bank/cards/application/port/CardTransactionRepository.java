package com.bank.cards.application.port;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardTransaction;

public interface CardTransactionRepository {

    List<Card> findCardsByCustomer(String customerId);

    Optional<Card> findCard(UUID cardId);

    Optional<CardTransaction> findByIdempotencyKey(String idempotencyKey);

    /** Descuenta saldo de forma atomica; false si el saldo disponible no alcanza. */
    boolean reserveFunds(UUID cardId, BigDecimal amount);

    void save(CardTransaction transaction);

    List<CardTransaction> findByCard(UUID cardId, int page, int size);

    long countByCard(UUID cardId);
}

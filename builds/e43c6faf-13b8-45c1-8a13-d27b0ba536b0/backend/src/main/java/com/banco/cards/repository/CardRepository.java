package com.banco.cards.repository;

import com.banco.cards.domain.Card;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository {

    Optional<Card> findById(UUID id);

    /** Actualiza el saldo solo si la versión coincide (bloqueo optimista). */
    boolean updateBalance(UUID id, BigDecimal newBalance, long expectedVersion);
}

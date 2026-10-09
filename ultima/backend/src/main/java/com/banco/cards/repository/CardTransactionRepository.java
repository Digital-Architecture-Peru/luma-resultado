package com.banco.cards.repository;

import com.banco.cards.domain.CardTransaction;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardTransactionRepository {

    void save(CardTransaction transaction);

    Optional<CardTransaction> findByIdempotencyKey(String key);

    List<CardTransaction> findRecentByCard(UUID cardId, int limit);
}

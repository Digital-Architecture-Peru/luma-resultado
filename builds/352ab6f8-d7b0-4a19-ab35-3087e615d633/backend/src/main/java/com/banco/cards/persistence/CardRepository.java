package com.banco.cards.persistence;

import com.banco.cards.domain.Card;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository {

    List<Card> findByCustomerId(String customerId);

    Optional<Card> findByIdAndCustomerId(UUID cardId, String customerId);
}

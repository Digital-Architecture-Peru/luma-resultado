package com.banco.cards.port;

import com.banco.cards.domain.Card;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de salida: la persistencia (PostgreSQL) queda detrás de esta interfaz. */
public interface CardRepository {

    List<Card> findByCustomer(String customerId);

    Optional<Card> findByIdAndCustomer(UUID cardId, String customerId);
}

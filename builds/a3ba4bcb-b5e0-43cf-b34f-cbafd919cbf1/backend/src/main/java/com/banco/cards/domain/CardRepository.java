package com.banco.cards.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de lectura. Toda consulta exige el cliente propietario (mitiga IDOR). */
public interface CardRepository {

    List<Card> findByCustomer(UUID customerId);

    Optional<Card> findByIdAndCustomer(UUID cardId, UUID customerId);
}

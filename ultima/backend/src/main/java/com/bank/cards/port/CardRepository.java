package com.bank.cards.port;

import com.bank.cards.domain.Card;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de lectura de tarjetas. La integracion con el core esta sin definir: se cambia el adaptador. */
public interface CardRepository {

    List<Card> findByCustomer(String customerId);

    Optional<Card> findByIdAndCustomer(UUID cardId, String customerId);
}

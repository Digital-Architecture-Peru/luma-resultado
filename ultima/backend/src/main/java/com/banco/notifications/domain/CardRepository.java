package com.banco.notifications.domain;

import java.util.List;
import java.util.UUID;

/** Puerto de acceso a tarjetas. */
public interface CardRepository {

    List<Card> findByCustomer(String customerId);

    boolean existsForCustomer(UUID cardId, String customerId);
}

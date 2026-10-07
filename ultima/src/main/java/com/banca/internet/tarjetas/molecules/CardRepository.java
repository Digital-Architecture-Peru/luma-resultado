package com.banca.internet.tarjetas.molecules;

import com.banca.internet.tarjetas.atoms.Card;
import com.banca.internet.tarjetas.atoms.CardStatus;
import java.util.List;
import java.util.Optional;

/** Puerto de lectura de tarjetas; la implementación concreta (PostgreSQL) vive en adapters. */
public interface CardRepository {

    List<Card> findByCustomer(String customerId, Optional<CardStatus> status, int limit, int offset);

    long countByCustomer(String customerId, Optional<CardStatus> status);

    Optional<Card> findByIdAndCustomer(long id, String customerId);
}

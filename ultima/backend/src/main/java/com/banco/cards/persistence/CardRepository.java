package com.banco.cards.persistence;

import com.banco.cards.domain.Card;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas derivadas (parametrizadas por JPA); siempre filtradas por cliente. */
public interface CardRepository extends JpaRepository<Card, UUID> {

    List<Card> findByCustomerIdOrderByStatusAscCreatedAtDesc(String customerId);

    Optional<Card> findByIdAndCustomerId(UUID id, String customerId);
}

package com.banco.cards.adapter;

import com.banco.cards.domain.Card;
import com.banco.cards.port.CardRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Adaptador PostgreSQL del puerto CardRepository; consultas con parámetros nombrados. */
@ApplicationScoped
public class PanacheCardRepository implements CardRepository, PanacheRepositoryBase<CardEntity, UUID> {

    @Override
    @Transactional
    public List<Card> findByCustomer(String customerId) {
        return list("customerId = :customerId order by alias", Parameters.with("customerId", customerId))
                .stream()
                .map(PanacheCardRepository::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public Optional<Card> findByIdAndCustomer(UUID cardId, String customerId) {
        return find("id = :id and customerId = :customerId",
                Parameters.with("id", cardId).and("customerId", customerId))
                .firstResultOptional()
                .map(PanacheCardRepository::toDomain);
    }

    private static Card toDomain(CardEntity e) {
        return new Card(e.id, e.customerId, e.panLast4.trim(), e.brand, e.type, e.status, e.alias,
                e.creditLimit, e.availableBalance, e.currency.trim(), e.expiryMonth, e.expiryYear, e.cutoffDay);
    }
}

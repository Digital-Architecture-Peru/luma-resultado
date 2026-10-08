package com.banco.cards.application;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CardQueryService {

    private final CardRepository repository;

    public CardQueryService(CardRepository repository) {
        this.repository = repository;
    }

    public List<Card> listFor(UUID customerId) {
        return repository.findByCustomer(customerId);
    }

    public Card getFor(UUID customerId, UUID cardId) {
        return repository.findByIdAndCustomer(cardId, customerId)
                .orElseThrow(CardNotFoundException::new);
    }
}

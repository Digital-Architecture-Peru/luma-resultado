package com.banco.cards.service;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardNotFoundException;
import com.banco.cards.port.CardRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

/** Casos de uso de consulta de tarjetas del cliente autenticado. */
@ApplicationScoped
public class CardQueryService {

    private final CardRepository repository;

    public CardQueryService(CardRepository repository) {
        this.repository = repository;
    }

    public List<Card> listCards(String customerId) {
        return repository.findByCustomer(requireCustomer(customerId));
    }

    public Card getCard(String customerId, UUID cardId) {
        return repository.findByIdAndCustomer(cardId, requireCustomer(customerId))
                .orElseThrow(() -> new CardNotFoundException(cardId));
    }

    private static String requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("Cliente no identificado");
        }
        return customerId;
    }
}

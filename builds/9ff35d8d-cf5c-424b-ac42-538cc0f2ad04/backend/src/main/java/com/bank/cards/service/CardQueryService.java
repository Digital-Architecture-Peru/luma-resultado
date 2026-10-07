package com.bank.cards.service;

import com.bank.cards.domain.Card;
import com.bank.cards.port.CardRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CardQueryService {

    private final CardRepository repository;

    public CardQueryService(CardRepository repository) {
        this.repository = repository;
    }

    public List<Card> listCards(String customerId) {
        requireCustomer(customerId);
        return repository.findByCustomer(customerId);
    }

    /** Una tarjeta ajena se trata igual que una inexistente (no revela su existencia). */
    public Card getCard(String customerId, UUID cardId) {
        requireCustomer(customerId);
        return repository.findByIdAndCustomer(cardId, customerId)
                .orElseThrow(() -> new CardNotFoundException(cardId));
    }

    private void requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("El identificador de cliente es obligatorio");
        }
    }
}

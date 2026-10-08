package com.banco.cards.service;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardNotFoundException;
import com.banco.cards.persistence.CardRepository;
import com.banco.cards.security.CurrentCustomerProvider;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CardQueryService {

    private final CardRepository repository;
    private final CurrentCustomerProvider customerProvider;

    public CardQueryService(CardRepository repository, CurrentCustomerProvider customerProvider) {
        this.repository = repository;
        this.customerProvider = customerProvider;
    }

    public List<Card> listMyCards() {
        return repository.findByCustomerId(customerProvider.currentCustomerId());
    }

    /** Una tarjeta ajena se trata igual que una inexistente para no revelar su existencia. */
    public Card getMyCard(UUID cardId) {
        return repository.findByIdAndCustomerId(cardId, customerProvider.currentCustomerId())
                .orElseThrow(() -> new CardNotFoundException(cardId));
    }
}

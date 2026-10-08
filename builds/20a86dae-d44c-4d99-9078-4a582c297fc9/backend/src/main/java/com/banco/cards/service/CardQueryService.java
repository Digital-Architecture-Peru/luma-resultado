package com.banco.cards.service;

import com.banco.cards.api.dto.CardDetailDto;
import com.banco.cards.api.dto.CardSummaryDto;
import com.banco.cards.persistence.CardRepository;
import com.banco.cards.security.CustomerContextProvider;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CardQueryService {

    private final CardRepository repository;
    private final CustomerContextProvider customerContext;

    public CardQueryService(CardRepository repository, CustomerContextProvider customerContext) {
        this.repository = repository;
        this.customerContext = customerContext;
    }

    public List<CardSummaryDto> listCards() {
        String customerId = customerContext.currentCustomerId();
        return repository.findByCustomerIdOrderByStatusAscCreatedAtDesc(customerId).stream()
                .map(CardSummaryDto::from)
                .toList();
    }

    /** Una tarjeta ajena se trata igual que una inexistente para no revelar su existencia. */
    public CardDetailDto getCard(UUID cardId) {
        String customerId = customerContext.currentCustomerId();
        return repository.findByIdAndCustomerId(cardId, customerId)
                .map(CardDetailDto::from)
                .orElseThrow(CardNotFoundException::new);
    }
}

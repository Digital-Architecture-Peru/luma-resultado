package com.bank.cards.application;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bank.cards.application.port.CardTransactionRepository;
import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardTransaction;

@Service
public class CardQueryService {

    public static final int MAX_PAGE_SIZE = 50;

    private final CardTransactionRepository repository;

    public CardQueryService(CardTransactionRepository repository) {
        this.repository = repository;
    }

    public List<Card> listCards(String customerId) {
        return repository.findCardsByCustomer(customerId);
    }

    public HistoryPage history(UUID cardId, int page, int size) {
        repository.findCard(cardId).orElseThrow(() -> new CardNotFoundException(cardId));
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        List<CardTransaction> items = repository.findByCard(cardId, safePage, safeSize);
        return new HistoryPage(items, safePage, safeSize, repository.countByCard(cardId));
    }

    public record HistoryPage(List<CardTransaction> items, int page, int size, long total) {
    }
}

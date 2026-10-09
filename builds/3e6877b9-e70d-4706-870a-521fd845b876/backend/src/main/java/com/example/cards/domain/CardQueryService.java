package com.example.cards.domain;

import com.example.cards.domain.DomainErrors.NotFoundException;
import com.example.cards.port.CardRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/** Casos de uso de consulta: tarjetas, cuentas y movimientos. */
@Service
public class CardQueryService {

    private static final int MAX_PAGE_SIZE = 100;

    private final CardRepository repository;

    public CardQueryService(CardRepository repository) {
        this.repository = repository;
    }

    public List<Card> listCards(String customerId) {
        return repository.findCardsByCustomer(customerId);
    }

    public List<Account> listAccounts(String customerId) {
        return repository.findAccountsByCustomer(customerId);
    }

    public TransactionPage listTransactions(String customerId, String cardId, int page, int size) {
        repository.findCard(customerId, cardId)
                .orElseThrow(() -> new NotFoundException("Tarjeta no encontrada"));
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        return new TransactionPage(
                repository.findTransactions(cardId, safePage, safeSize),
                safePage,
                safeSize,
                repository.countTransactions(cardId));
    }

    public record TransactionPage(List<CardTransaction> items, int page, int size, long total) {
    }
}

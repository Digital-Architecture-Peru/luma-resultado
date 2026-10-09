package com.banco.cards.service;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardTransaction;
import com.banco.cards.domain.CardTransaction.Status;
import com.banco.cards.domain.Errors.BusinessRuleException;
import com.banco.cards.domain.Errors.CardNotFoundException;
import com.banco.cards.domain.Errors.ConcurrentUpdateException;
import com.banco.cards.domain.Errors.DuplicateRequestException;
import com.banco.cards.domain.Errors.InvalidRequestException;
import com.banco.cards.domain.TransactionType;
import com.banco.cards.integration.CardCoreGateway;
import com.banco.cards.repository.CardRepository;
import com.banco.cards.repository.CardTransactionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CardTransactionService {

    static final int MAX_LIMIT = 100;
    static final int MAX_KEY_LENGTH = 64;

    private final CardRepository cards;
    private final CardTransactionRepository transactions;
    private final CardCoreGateway gateway;
    private final Clock clock;

    /**
     * Constructor usado por CDI. Con dos constructores Quarkus exige marcar explícitamente
     * cuál es el de inyección; el otro es solo para pruebas (reloj fijo).
     */
    @Inject
    public CardTransactionService(CardRepository cards, CardTransactionRepository transactions,
                                  CardCoreGateway gateway) {
        this(cards, transactions, gateway, Clock.systemUTC());
    }

    CardTransactionService(CardRepository cards, CardTransactionRepository transactions,
                           CardCoreGateway gateway, Clock clock) {
        this.cards = cards;
        this.transactions = transactions;
        this.gateway = gateway;
        this.clock = clock;
    }

    public List<CardTransaction> list(UUID cardId, int limit) {
        cards.findById(cardId).orElseThrow(() -> new CardNotFoundException("No existe la tarjeta " + cardId));
        int bounded = Math.max(1, Math.min(limit, MAX_LIMIT));
        return transactions.findRecentByCard(cardId, bounded);
    }

    @Transactional
    public CardTransaction register(UUID cardId, String idempotencyKey, TransactionType type,
                                    BigDecimal amount, String currency, String description) {
        validateKey(idempotencyKey);
        if (transactions.findByIdempotencyKey(idempotencyKey).isPresent()) {
            throw new DuplicateRequestException("La Idempotency-Key ya fue utilizada");
        }
        Card card = cards.findById(cardId)
                .orElseThrow(() -> new CardNotFoundException("No existe la tarjeta " + cardId));
        if (!card.isActive()) {
            throw new BusinessRuleException("La tarjeta no está activa");
        }
        Card updated = card.apply(type, amount);
        if (!gateway.authorize(card, type, amount, currency)) {
            throw new BusinessRuleException("Operación rechazada por el core de tarjetas");
        }
        if (!cards.updateBalance(cardId, updated.availableBalance(), card.version())) {
            throw new ConcurrentUpdateException("La tarjeta fue modificada, reintente la operación");
        }
        CardTransaction tx = new CardTransaction(UUID.randomUUID(), cardId, type, amount, currency,
                description, Status.APPROVED, idempotencyKey, Instant.now(clock));
        transactions.save(tx);
        return tx;
    }

    private static void validateKey(String key) {
        if (key == null || key.isBlank() || key.length() > MAX_KEY_LENGTH) {
            throw new InvalidRequestException("Idempotency-Key es obligatoria (máx. " + MAX_KEY_LENGTH + " caracteres)");
        }
    }
}

package com.banco.cards.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.Card.CardStatus;
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
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CardTransactionServiceTest {

    private static final UUID CARD_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final Clock CLOCK = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);

    private CardRepository cards;
    private CardTransactionRepository transactions;
    private CardCoreGateway gateway;
    private CardTransactionService service;

    @BeforeEach
    void setUp() {
        cards = mock(CardRepository.class);
        transactions = mock(CardTransactionRepository.class);
        gateway = mock(CardCoreGateway.class);
        service = new CardTransactionService(cards, transactions, gateway, CLOCK);
        when(transactions.findByIdempotencyKey(any())).thenReturn(Optional.empty());
        when(gateway.authorize(any(), any(), any(), any())).thenReturn(true);
    }

    private static Card card(CardStatus status, String balance) {
        return new Card(CARD_ID, "**** 1234", status, new BigDecimal("5000.00"), new BigDecimal(balance), 3L);
    }

    @Test
    void givenActiveCardWhenPurchaseThenBalanceDecreasesAndTransactionIsSaved() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "1000.00")));
        when(cards.updateBalance(CARD_ID, new BigDecimal("750.00"), 3L)).thenReturn(true);

        CardTransaction tx = service.register(CARD_ID, "key-1", TransactionType.PURCHASE,
                new BigDecimal("250.00"), "USD", "Compra");

        assertEquals(Status.APPROVED, tx.status());
        assertEquals(Instant.parse("2026-01-01T00:00:00Z"), tx.createdAt());
        verify(transactions).save(tx);
    }

    @Test
    void givenActiveCardWhenPaymentThenBalanceIncreases() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "1000.00")));
        when(cards.updateBalance(CARD_ID, new BigDecimal("1300.00"), 3L)).thenReturn(true);

        CardTransaction tx = service.register(CARD_ID, "key-2", TransactionType.PAYMENT,
                new BigDecimal("300.00"), "USD", null);

        assertEquals(TransactionType.PAYMENT, tx.type());
    }

    @Test
    void givenInsufficientBalanceWhenPurchaseThenBusinessRuleFails() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "100.00")));

        assertThrows(BusinessRuleException.class, () -> service.register(CARD_ID, "key-3",
                TransactionType.PURCHASE, new BigDecimal("100.01"), "USD", null));
        verify(transactions, never()).save(any());
    }

    @Test
    void givenPaymentAboveCreditLimitThenBusinessRuleFails() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "4900.00")));

        assertThrows(BusinessRuleException.class, () -> service.register(CARD_ID, "key-4",
                TransactionType.PAYMENT, new BigDecimal("200.00"), "USD", null));
    }

    @Test
    void givenBlockedCardWhenPurchaseThenBusinessRuleFails() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.BLOCKED, "1000.00")));

        assertThrows(BusinessRuleException.class, () -> service.register(CARD_ID, "key-5",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
    }

    @Test
    void givenUsedIdempotencyKeyThenDuplicateRequestFails() {
        CardTransaction existing = new CardTransaction(UUID.randomUUID(), CARD_ID, TransactionType.PURCHASE,
                BigDecimal.TEN, "USD", null, Status.APPROVED, "key-6", Instant.now(CLOCK));
        when(transactions.findByIdempotencyKey("key-6")).thenReturn(Optional.of(existing));

        assertThrows(DuplicateRequestException.class, () -> service.register(CARD_ID, "key-6",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
        verify(cards, never()).updateBalance(any(), any(), anyLong());
    }

    @Test
    void givenBlankIdempotencyKeyThenInvalidRequestFails() {
        assertThrows(InvalidRequestException.class, () -> service.register(CARD_ID, " ",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
    }

    @Test
    void givenUnknownCardThenNotFoundFails() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> service.register(CARD_ID, "key-7",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
    }

    @Test
    void givenGatewayDeclinesThenNothingIsPersisted() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "1000.00")));
        when(gateway.authorize(any(), any(), any(), any())).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> service.register(CARD_ID, "key-8",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
        verify(cards, never()).updateBalance(any(), any(), anyLong());
        verify(transactions, never()).save(any());
    }

    @Test
    void givenVersionConflictThenConcurrentUpdateFails() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "1000.00")));
        when(cards.updateBalance(any(), any(), anyLong())).thenReturn(false);

        assertThrows(ConcurrentUpdateException.class, () -> service.register(CARD_ID, "key-9",
                TransactionType.PURCHASE, BigDecimal.TEN, "USD", null));
        verify(transactions, never()).save(any());
    }

    @Test
    void givenHugeLimitWhenListThenLimitIsCapped() {
        when(cards.findById(CARD_ID)).thenReturn(Optional.of(card(CardStatus.ACTIVE, "1000.00")));

        service.list(CARD_ID, 5000);

        verify(transactions).findRecentByCard(CARD_ID, CardTransactionService.MAX_LIMIT);
    }
}

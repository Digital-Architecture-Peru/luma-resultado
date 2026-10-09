package com.bank.cards.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bank.cards.application.port.CardNetworkPort;
import com.bank.cards.application.port.CardTransactionRepository;
import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardTransaction;
import com.bank.cards.domain.TransactionStatus;

class CreateTransactionUseCaseTest {

    private static final UUID CARD_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    private CardTransactionRepository repository;
    private CardNetworkPort network;
    private CreateTransactionUseCase useCase;

    @BeforeEach
    void setUp() {
        repository = mock(CardTransactionRepository.class);
        network = mock(CardNetworkPort.class);
        useCase = new CreateTransactionUseCase(repository, network, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private static Card card(String status) {
        return new Card(CARD_ID, "cust", "****1234", "VISA", status,
                new BigDecimal("5000.00"), new BigDecimal("3200.00"));
    }

    private static CreateTransactionCommand command(String amount, String key) {
        return new CreateTransactionCommand(CARD_ID, new BigDecimal(amount), "USD", "acc-1", "pago", key);
    }

    @Test
    void givenValidCommand_whenExecute_thenApprovesAndSaves() {
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("ACTIVE")));
        when(repository.findByIdempotencyKey("k1")).thenReturn(Optional.empty());
        when(network.authorize(any(), any(), any())).thenReturn(true);
        when(repository.reserveFunds(CARD_ID, new BigDecimal("100.00"))).thenReturn(true);

        CardTransaction tx = useCase.execute(command("100.00", "k1"));

        assertEquals(TransactionStatus.APPROVED, tx.status());
        assertEquals(NOW, tx.createdAt());
        verify(repository).save(tx);
    }

    @Test
    void givenUnknownCard_whenExecute_thenNotFound() {
        when(repository.findCard(CARD_ID)).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> useCase.execute(command("10.00", "k")));
    }

    @Test
    void givenBlockedCard_whenExecute_thenBusinessRuleAndNoDebit() {
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("BLOCKED")));
        when(repository.findByIdempotencyKey("k")).thenReturn(Optional.empty());

        assertThrows(BusinessRuleException.class, () -> useCase.execute(command("10.00", "k")));
        verify(repository, never()).reserveFunds(any(), any());
    }

    @Test
    void givenInsufficientBalance_whenExecute_thenBusinessRuleAndNoSave() {
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("ACTIVE")));
        when(repository.findByIdempotencyKey("k")).thenReturn(Optional.empty());
        when(network.authorize(any(), any(), any())).thenReturn(true);
        when(repository.reserveFunds(any(), any())).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> useCase.execute(command("9999.00", "k")));
        verify(repository, never()).save(any());
    }

    @Test
    void givenNetworkDecline_whenExecute_thenBusinessRule() {
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("ACTIVE")));
        when(repository.findByIdempotencyKey("k")).thenReturn(Optional.empty());
        when(network.authorize(any(), any(), any())).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> useCase.execute(command("10.00", "k")));
        verify(repository, never()).reserveFunds(any(), any());
    }

    @Test
    void givenSameKeyAndRequest_whenExecute_thenReturnsPreviousWithoutDebit() {
        CardTransaction previous = new CardTransaction(UUID.randomUUID(), CARD_ID, new BigDecimal("10.00"),
                "USD", "acc-1", "pago", TransactionStatus.APPROVED, "k", NOW);
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("ACTIVE")));
        when(repository.findByIdempotencyKey("k")).thenReturn(Optional.of(previous));

        assertSame(previous, useCase.execute(command("10.0", "k")));
        verify(repository, never()).reserveFunds(any(), any());
    }

    @Test
    void givenSameKeyDifferentAmount_whenExecute_thenConflict() {
        CardTransaction previous = new CardTransaction(UUID.randomUUID(), CARD_ID, new BigDecimal("10.00"),
                "USD", "acc-1", "pago", TransactionStatus.APPROVED, "k", NOW);
        when(repository.findCard(CARD_ID)).thenReturn(Optional.of(card("ACTIVE")));
        when(repository.findByIdempotencyKey("k")).thenReturn(Optional.of(previous));

        assertThrows(IdempotencyConflictException.class, () -> useCase.execute(command("25.00", "k")));
    }
}

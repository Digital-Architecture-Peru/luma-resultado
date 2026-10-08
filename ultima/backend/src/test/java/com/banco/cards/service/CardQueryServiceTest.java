package com.banco.cards.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardNotFoundException;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.persistence.CardRepository;
import com.banco.cards.security.CurrentCustomerProvider;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CardQueryServiceTest {

    private static final String CUSTOMER = "CUST-0001";

    @Mock
    private CardRepository repository;

    @Mock
    private CurrentCustomerProvider customerProvider;

    private CardQueryService service;

    @BeforeEach
    void setUp() {
        service = new CardQueryService(repository, customerProvider);
        when(customerProvider.currentCustomerId()).thenReturn(CUSTOMER);
    }

    private Card sampleCard(UUID id) {
        return new Card(id, CUSTOMER, "1111", "**** **** **** 1111", "VISA", "CREDIT",
                CardStatus.ACTIVE, new BigDecimal("5000.00"), new BigDecimal("100.00"), "USD",
                Instant.parse("2026-01-01T00:00:00Z"));
    }

    @Test
    void givenCustomerWithCards_whenList_thenReturnsRepositoryResultForCurrentCustomer() {
        Card card = sampleCard(UUID.randomUUID());
        when(repository.findByCustomerId(CUSTOMER)).thenReturn(List.of(card));

        assertEquals(List.of(card), service.listMyCards());
    }

    @Test
    void givenOwnedCard_whenGet_thenReturnsCard() {
        UUID id = UUID.randomUUID();
        Card card = sampleCard(id);
        when(repository.findByIdAndCustomerId(id, CUSTOMER)).thenReturn(Optional.of(card));

        assertEquals(card, service.getMyCard(id));
    }

    @Test
    void givenUnknownOrForeignCard_whenGet_thenThrowsNotFound() {
        UUID id = UUID.randomUUID();
        when(repository.findByIdAndCustomerId(id, CUSTOMER)).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> service.getMyCard(id));
    }
}

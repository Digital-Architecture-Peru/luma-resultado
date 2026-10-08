package com.banco.cards.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.banco.cards.api.dto.CardDetailDto;
import com.banco.cards.api.dto.CardSummaryDto;
import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import com.banco.cards.persistence.CardRepository;
import com.banco.cards.security.CustomerContextProvider;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
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

    private static final String CUSTOMER = "CUST-TEST";
    private static final UUID CARD_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");

    @Mock
    private CardRepository repository;
    @Mock
    private CustomerContextProvider context;

    private CardQueryService service;

    @BeforeEach
    void setUp() {
        service = new CardQueryService(repository, context);
        when(context.currentCustomerId()).thenReturn(CUSTOMER);
    }

    private Card sampleCard() {
        return new Card(CARD_ID, CUSTOMER, "4821", CardType.CREDIT, CardStatus.ACTIVE,
                new BigDecimal("5000.00"), new BigDecimal("3250.75"), "USD", 11, 2028, OffsetDateTime.now());
    }

    @Test
    void givenCustomerWithCards_whenList_thenReturnsMaskedSummaries() {
        when(repository.findByCustomerIdOrderByStatusAscCreatedAtDesc(CUSTOMER)).thenReturn(List.of(sampleCard()));

        List<CardSummaryDto> result = service.listCards();

        assertEquals(1, result.size());
        assertEquals("**** **** **** 4821", result.get(0).maskedPan());
        assertEquals(new BigDecimal("3250.75"), result.get(0).availableBalance());
    }

    @Test
    void givenCustomerWithoutCards_whenList_thenReturnsEmpty() {
        when(repository.findByCustomerIdOrderByStatusAscCreatedAtDesc(CUSTOMER)).thenReturn(List.of());

        assertEquals(0, service.listCards().size());
    }

    @Test
    void givenOwnedCard_whenGet_thenReturnsDetail() {
        when(repository.findByIdAndCustomerId(CARD_ID, CUSTOMER)).thenReturn(Optional.of(sampleCard()));

        CardDetailDto detail = service.getCard(CARD_ID);

        assertEquals(CARD_ID, detail.id());
        assertEquals(new BigDecimal("5000.00"), detail.creditLimit());
        assertEquals(2028, detail.expiryYear());
    }

    @Test
    void givenForeignOrMissingCard_whenGet_thenThrowsNotFound() {
        when(repository.findByIdAndCustomerId(CARD_ID, CUSTOMER)).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> service.getCard(CARD_ID));
    }
}

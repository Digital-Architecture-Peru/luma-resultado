package com.banco.cards.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardRepository;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CardQueryServiceTest {

    private static final UUID OWNER = UUID.randomUUID();
    private static final UUID OTHER = UUID.randomUUID();

    private final CardRepository repository = mock(CardRepository.class);
    private final CardQueryService service = new CardQueryService(repository);

    private static Card card(UUID customer) {
        return new Card(UUID.randomUUID(), customer, "1234", "VISA", CardType.CREDIT,
                CardStatus.ACTIVE, "ANA EJEMPLO", new BigDecimal("5000.00"),
                new BigDecimal("100.00"), "USD");
    }

    @Test
    void givenCustomer_whenList_thenQueriesRepositoryFilteredByThatCustomer() {
        Card mine = card(OWNER);
        when(repository.findByCustomer(OWNER)).thenReturn(List.of(mine));

        List<Card> result = service.listFor(OWNER);

        assertEquals(List.of(mine), result);
        verify(repository).findByCustomer(OWNER);
    }

    @Test
    void givenOwnCard_whenGet_thenReturnsCard() {
        Card mine = card(OWNER);
        when(repository.findByIdAndCustomer(mine.id(), OWNER)).thenReturn(Optional.of(mine));

        assertEquals(mine, service.getFor(OWNER, mine.id()));
    }

    @Test
    void givenCardOfAnotherCustomer_whenGet_thenNotFound() {
        Card foreign = card(OTHER);
        when(repository.findByIdAndCustomer(foreign.id(), OWNER)).thenReturn(Optional.empty());

        assertThrows(CardNotFoundException.class, () -> service.getFor(OWNER, foreign.id()));
    }

    @Test
    void givenCard_whenMasked_thenOnlyLast4Visible() {
        assertEquals("**** **** **** 1234", card(OWNER).maskedNumber());
    }
}

package com.bank.cards.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardStatus;
import com.bank.cards.domain.CardType;
import com.bank.cards.port.CardRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CardQueryServiceTest {

    private static final String CUSTOMER = "CUST-1001";

    @Mock
    private CardRepository repository;

    private Card sampleCard(UUID id) {
        return new Card(id, CUSTOMER, "Visa", "4821", CardType.CREDIT, CardStatus.ACTIVE,
                new BigDecimal("1000.00"), new BigDecimal("500.00"), "USD", LocalDate.of(2028, 1, 31));
    }

    @Test
    void givenCustomer_whenListCards_thenReturnsRepositoryCards() {
        Card card = sampleCard(UUID.randomUUID());
        when(repository.findByCustomer(CUSTOMER)).thenReturn(List.of(card));

        List<Card> result = new CardQueryService(repository).listCards(CUSTOMER);

        assertThat(result).containsExactly(card);
    }

    @Test
    void givenBlankCustomer_whenListCards_thenRejectsWithoutQuerying() {
        CardQueryService service = new CardQueryService(repository);

        assertThatThrownBy(() -> service.listCards(" "))
                .isInstanceOf(IllegalArgumentException.class);
        verifyNoInteractions(repository);
    }

    @Test
    void givenOwnedCard_whenGetCard_thenReturnsIt() {
        UUID id = UUID.randomUUID();
        Card card = sampleCard(id);
        when(repository.findByIdAndCustomer(id, CUSTOMER)).thenReturn(Optional.of(card));

        assertThat(new CardQueryService(repository).getCard(CUSTOMER, id)).isEqualTo(card);
    }

    @Test
    void givenForeignOrMissingCard_whenGetCard_thenThrowsNotFound() {
        UUID id = UUID.randomUUID();
        when(repository.findByIdAndCustomer(id, "OTHER")).thenReturn(Optional.empty());
        CardQueryService service = new CardQueryService(repository);

        assertThatThrownBy(() -> service.getCard("OTHER", id))
                .isInstanceOf(CardNotFoundException.class);
    }
}

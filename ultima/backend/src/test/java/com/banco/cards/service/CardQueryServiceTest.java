package com.banco.cards.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardNotFoundException;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import com.banco.cards.port.CardRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CardQueryServiceTest {

    private static final UUID ID_A = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID ID_B = UUID.fromString("44444444-4444-4444-8444-444444444444");

    private final List<Card> data = List.of(card(ID_A, "cust-001"), card(ID_B, "cust-002"));

    private final CardRepository fakeRepository = new CardRepository() {
        @Override
        public List<Card> findByCustomer(String customerId) {
            return data.stream().filter(c -> c.customerId().equals(customerId)).toList();
        }

        @Override
        public Optional<Card> findByIdAndCustomer(UUID cardId, String customerId) {
            return data.stream()
                    .filter(c -> c.id().equals(cardId) && c.customerId().equals(customerId))
                    .findFirst();
        }
    };

    private final CardQueryService service = new CardQueryService(fakeRepository);

    @Test
    void givenCustomer_whenListCards_thenReturnsOnlyTheirCards() {
        List<Card> cards = service.listCards("cust-001");

        assertEquals(1, cards.size());
        assertEquals(ID_A, cards.get(0).id());
    }

    @Test
    void givenOwnCard_whenGetCard_thenReturnsIt() {
        assertEquals(ID_A, service.getCard("cust-001", ID_A).id());
    }

    @Test
    void givenForeignCard_whenGetCard_thenThrowsNotFound() {
        assertThrows(CardNotFoundException.class, () -> service.getCard("cust-001", ID_B));
    }

    @Test
    void givenBlankCustomer_whenListCards_thenThrowsIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.listCards(" "));
        assertThrows(IllegalArgumentException.class, () -> service.getCard(null, ID_A));
    }

    private static Card card(UUID id, String customerId) {
        return new Card(id, customerId, "4242", "VISA", CardType.CREDIT, CardStatus.ACTIVE, "Visa Demo",
                new BigDecimal("1000.00"), new BigDecimal("800.00"), "USD", 8, 2028, 15);
    }
}

package com.banco.cards.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CardDtoTest {

    private final Card card = new Card(UUID.randomUUID(), "cust-001", "4242", "VISA", CardType.CREDIT,
            CardStatus.ACTIVE, "Visa Demo", new BigDecimal("1000.00"), new BigDecimal("800.00"),
            "USD", 3, 2028, 15);

    @Test
    void givenCard_whenDetailDto_thenExpiryIsMmYyAndPanMasked() {
        CardDetailDto dto = CardDetailDto.from(card);

        assertEquals("03/28", dto.expiry());
        assertEquals("**** **** **** 4242", dto.maskedPan());
        assertEquals("ACTIVE", dto.status());
    }

    @Test
    void givenCard_whenSummaryDto_thenKeepsTypeAndBrand() {
        CardSummaryDto dto = CardSummaryDto.from(card);

        assertEquals("CREDIT", dto.type());
        assertEquals("VISA", dto.brand());
    }
}

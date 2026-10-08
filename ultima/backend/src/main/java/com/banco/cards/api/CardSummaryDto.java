package com.banco.cards.api;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record CardSummaryDto(
        UUID id,
        String maskedPan,
        String brand,
        String cardType,
        CardStatus status,
        BigDecimal availableBalance,
        String currency) {

    public static CardSummaryDto from(Card card) {
        return new CardSummaryDto(card.id(), card.maskedPan(), card.brand(), card.cardType(),
                card.status(), card.availableBalance(), card.currency());
    }
}

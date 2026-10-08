package com.banco.cards.api.dto;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import java.math.BigDecimal;
import java.util.UUID;

public record CardSummaryDto(UUID id, String maskedPan, CardType type, CardStatus status,
                             BigDecimal availableBalance, String currency) {

    public static String mask(String last4) {
        return "**** **** **** " + last4;
    }

    public static CardSummaryDto from(Card card) {
        return new CardSummaryDto(card.getId(), mask(card.getPanLast4()), card.getType(),
                card.getStatus(), card.getAvailableBalance(), card.getCurrency());
    }
}

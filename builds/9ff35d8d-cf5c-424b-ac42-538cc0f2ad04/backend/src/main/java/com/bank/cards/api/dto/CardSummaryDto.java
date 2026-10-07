package com.bank.cards.api.dto;

import com.bank.cards.domain.Card;
import java.math.BigDecimal;

public record CardSummaryDto(
        String id,
        String alias,
        String maskedNumber,
        String type,
        String status,
        BigDecimal availableBalance,
        String currency) {

    public static CardSummaryDto from(Card card) {
        return new CardSummaryDto(
                card.id().toString(),
                card.alias(),
                mask(card.last4()),
                card.type().name(),
                card.status().name(),
                card.availableBalance(),
                card.currency());
    }

    static String mask(String last4) {
        return "**** **** **** " + last4;
    }
}

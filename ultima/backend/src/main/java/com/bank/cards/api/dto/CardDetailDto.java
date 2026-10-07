package com.bank.cards.api.dto;

import com.bank.cards.domain.Card;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CardDetailDto(
        String id,
        String alias,
        String maskedNumber,
        String type,
        String status,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        LocalDate expiryDate) {

    public static CardDetailDto from(Card card) {
        return new CardDetailDto(
                card.id().toString(),
                card.alias(),
                CardSummaryDto.mask(card.last4()),
                card.type().name(),
                card.status().name(),
                card.creditLimit(),
                card.availableBalance(),
                card.currency(),
                card.expiryDate());
    }
}

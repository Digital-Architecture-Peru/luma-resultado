package com.banco.cards.api.dto;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import java.math.BigDecimal;
import java.util.UUID;

public record CardDetailDto(UUID id, String maskedPan, CardType type, CardStatus status,
                            BigDecimal creditLimit, BigDecimal availableBalance, String currency,
                            int expiryMonth, int expiryYear) {

    public static CardDetailDto from(Card card) {
        return new CardDetailDto(card.getId(), CardSummaryDto.mask(card.getPanLast4()), card.getType(),
                card.getStatus(), card.getCreditLimit(), card.getAvailableBalance(), card.getCurrency(),
                card.getExpiryMonth(), card.getExpiryYear());
    }
}

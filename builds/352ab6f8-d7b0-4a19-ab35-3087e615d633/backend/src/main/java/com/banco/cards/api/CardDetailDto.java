package com.banco.cards.api;

import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CardDetailDto(
        UUID id,
        String maskedPan,
        String panLast4,
        String brand,
        String cardType,
        CardStatus status,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        Instant createdAt) {

    public static CardDetailDto from(Card card) {
        return new CardDetailDto(card.id(), card.maskedPan(), card.panLast4(), card.brand(),
                card.cardType(), card.status(), card.creditLimit(), card.availableBalance(),
                card.currency(), card.createdAt());
    }
}

package com.banco.cards.api;

import com.banco.cards.domain.Card;
import com.banco.cards.service.PanMasker;
import java.math.BigDecimal;
import java.util.UUID;

public record CardDetailDto(
        UUID id,
        String alias,
        String maskedPan,
        String type,
        String brand,
        String status,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency,
        int cutoffDay,
        String expiry) {

    public static CardDetailDto from(Card card) {
        String expiry = String.format("%02d/%02d", card.expiryMonth(), card.expiryYear() % 100);
        return new CardDetailDto(card.id(), card.alias(), PanMasker.mask(card.panLast4()),
                card.type().name(), card.brand(), card.status().name(), card.creditLimit(),
                card.availableBalance(), card.currency(), card.cutoffDay(), expiry);
    }
}

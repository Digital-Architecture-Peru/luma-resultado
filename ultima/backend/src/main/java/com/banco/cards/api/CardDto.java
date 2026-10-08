package com.banco.cards.api;

import com.banco.cards.domain.Card;
import java.math.BigDecimal;
import java.util.UUID;

/** Contrato publico: sin customerId, PAN completo ni CVV. */
public record CardDto(
        UUID id,
        String maskedNumber,
        String last4,
        String brand,
        String type,
        String status,
        String holderName,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        String currency) {

    public static CardDto from(Card card) {
        return new CardDto(
                card.id(),
                card.maskedNumber(),
                card.last4(),
                card.brand(),
                card.type().name(),
                card.status().name(),
                card.holderName(),
                card.creditLimit(),
                card.availableBalance(),
                card.currency());
    }
}

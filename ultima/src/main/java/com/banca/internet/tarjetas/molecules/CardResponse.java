package com.banca.internet.tarjetas.molecules;

import com.banca.internet.tarjetas.atoms.Card;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Molecule: DTO de salida con el número enmascarado. */
public record CardResponse(
        long id,
        String maskedNumber,
        String brand,
        String cardType,
        String status,
        String currency,
        BigDecimal creditLimit,
        BigDecimal availableBalance,
        LocalDate expiryDate) {

    public static CardResponse from(Card card) {
        return new CardResponse(
                card.id(),
                card.pan().display(),
                card.brand(),
                card.cardType(),
                card.status().name(),
                card.currency(),
                card.creditLimit(),
                card.availableBalance(),
                card.expiryDate());
    }
}

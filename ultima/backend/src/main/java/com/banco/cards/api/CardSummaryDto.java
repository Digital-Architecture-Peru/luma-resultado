package com.banco.cards.api;

import com.banco.cards.domain.Card;
import com.banco.cards.service.PanMasker;
import java.util.UUID;

public record CardSummaryDto(UUID id, String alias, String maskedPan, String type, String brand, String status) {

    public static CardSummaryDto from(Card card) {
        return new CardSummaryDto(card.id(), card.alias(), PanMasker.mask(card.panLast4()),
                card.type().name(), card.brand(), card.status().name());
    }
}

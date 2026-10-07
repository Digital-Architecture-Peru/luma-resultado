package com.banca.tarjetas.molecules;

import com.banca.tarjetas.atoms.PanMasker;
import com.banca.tarjetas.dto.CardDetailDto;
import com.banca.tarjetas.dto.CardSummaryDto;
import com.banca.tarjetas.model.Card;
import jakarta.enterprise.context.ApplicationScoped;

/** Molécula: combina átomos para transformar dominio en DTOs seguros. */
@ApplicationScoped
public class CardMapper {

    public CardSummaryDto toSummary(Card card) {
        return new CardSummaryDto(
                card.id(),
                PanMasker.mask(card.pan()),
                card.brand(),
                card.status().name(),
                card.expiry().toString(),
                card.availableBalance(),
                card.currency());
    }

    public CardDetailDto toDetail(Card card) {
        return new CardDetailDto(
                card.id(),
                PanMasker.mask(card.pan()),
                card.holderName(),
                card.brand(),
                card.status().name(),
                card.expiry().toString(),
                card.creditLimit(),
                card.availableBalance(),
                card.currency());
    }
}

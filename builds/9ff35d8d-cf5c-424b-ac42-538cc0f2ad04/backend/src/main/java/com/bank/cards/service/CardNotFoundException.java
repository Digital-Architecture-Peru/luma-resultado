package com.bank.cards.service;

import java.util.UUID;

public class CardNotFoundException extends RuntimeException {

    public CardNotFoundException(UUID cardId) {
        super("Tarjeta no encontrada: " + cardId);
    }
}

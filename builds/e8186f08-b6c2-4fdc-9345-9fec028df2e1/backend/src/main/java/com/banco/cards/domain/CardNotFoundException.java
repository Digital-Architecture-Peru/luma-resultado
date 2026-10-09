package com.banco.cards.domain;

import java.util.UUID;

/** La tarjeta no existe o no pertenece al cliente (se responde igual para evitar enumeración). */
public class CardNotFoundException extends RuntimeException {

    public CardNotFoundException(UUID cardId) {
        super("Tarjeta no encontrada: " + cardId);
    }
}

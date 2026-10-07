package com.banca.tarjetas.model;

/** La tarjeta solicitada no existe (se traduce a 404). */
public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException(String cardId) {
        super("Tarjeta no encontrada: " + cardId);
    }
}

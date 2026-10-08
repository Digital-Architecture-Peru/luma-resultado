package com.banco.cards.application;

public class CardNotFoundException extends RuntimeException {

    public CardNotFoundException() {
        super("Tarjeta no encontrada");
    }
}

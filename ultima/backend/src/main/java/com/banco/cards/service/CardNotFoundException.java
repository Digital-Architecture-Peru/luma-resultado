package com.banco.cards.service;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException() {
        super("Tarjeta no encontrada");
    }
}

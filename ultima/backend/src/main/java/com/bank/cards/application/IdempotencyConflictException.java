package com.bank.cards.application;

public class IdempotencyConflictException extends RuntimeException {

    public IdempotencyConflictException(String key) {
        super("La clave de idempotencia ya fue usada con otra solicitud: " + key);
    }
}

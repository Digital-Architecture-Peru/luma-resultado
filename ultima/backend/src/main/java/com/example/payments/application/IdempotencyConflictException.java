package com.example.payments.application;

public class IdempotencyConflictException extends RuntimeException {

    public IdempotencyConflictException(String key) {
        super("La clave de idempotencia se uso con una peticion distinta: " + key);
    }
}

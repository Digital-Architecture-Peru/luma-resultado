package com.example.payments.domain;

public class DuplicateIdempotencyKeyException extends RuntimeException {

    public DuplicateIdempotencyKeyException(String key) {
        super("La clave de idempotencia ya existe: " + key);
    }
}

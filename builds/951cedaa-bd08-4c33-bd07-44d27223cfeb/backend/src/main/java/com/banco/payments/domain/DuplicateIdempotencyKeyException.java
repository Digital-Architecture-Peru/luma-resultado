package com.banco.payments.domain;

/** La clave de idempotencia ya fue usada por otro pago (HTTP 409). */
public class DuplicateIdempotencyKeyException extends RuntimeException {
    public DuplicateIdempotencyKeyException(String key) {
        super("La clave de idempotencia ya fue utilizada: " + key);
    }
}

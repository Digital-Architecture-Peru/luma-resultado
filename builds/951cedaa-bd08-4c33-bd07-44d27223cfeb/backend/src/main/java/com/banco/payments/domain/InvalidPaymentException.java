package com.banco.payments.domain;

/** Violacion de una regla de dominio del pago (se traduce a HTTP 400). */
public class InvalidPaymentException extends RuntimeException {
    public InvalidPaymentException(String message) {
        super(message);
    }
}

package com.banco.payments.infrastructure;

public class PaymentPersistenceException extends RuntimeException {
    public PaymentPersistenceException(String message, Throwable cause) {
        super(message, cause);
    }
}

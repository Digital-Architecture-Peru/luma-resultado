package com.banco.payments.application;

/** Errores del dominio de pagos; el adaptador web los traduce a problem+json. */
public final class PaymentErrors {

    private PaymentErrors() {
    }

    public static class InvalidPayment extends RuntimeException {
        public InvalidPayment(String message) {
            super(message);
        }
    }

    public static class NotFound extends RuntimeException {
        public NotFound(String message) {
            super(message);
        }
    }

    public static class InsufficientFunds extends RuntimeException {
        public InsufficientFunds(String message) {
            super(message);
        }
    }

    public static class IdempotencyConflict extends RuntimeException {
        public IdempotencyConflict(String message) {
            super(message);
        }
    }

    public static class ConcurrentUpdate extends RuntimeException {
        public ConcurrentUpdate(String message) {
            super(message);
        }
    }
}

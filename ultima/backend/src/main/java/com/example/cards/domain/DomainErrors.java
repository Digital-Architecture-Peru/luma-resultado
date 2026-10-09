package com.example.cards.domain;

/** Errores del dominio; la capa API los traduce a códigos HTTP (404, 409, 422). */
public final class DomainErrors {

    private DomainErrors() {
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }

    public static class DuplicatePaymentException extends RuntimeException {
        public DuplicatePaymentException() {
            super("Ya existe un pago registrado con esta Idempotency-Key");
        }
    }

    public static class ConcurrentUpdateException extends RuntimeException {
        public ConcurrentUpdateException() {
            super("Los saldos cambiaron durante la operación; reintente");
        }
    }

    public static class PaymentRejectedException extends RuntimeException {
        public PaymentRejectedException(String message) {
            super(message);
        }
    }
}

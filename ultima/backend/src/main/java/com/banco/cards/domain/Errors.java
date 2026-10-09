package com.banco.cards.domain;

/** Errores concretos del dominio de transacciones de tarjeta. */
public final class Errors {

    private Errors() {
    }

    public static class InvalidRequestException extends DomainException {
        public InvalidRequestException(String detail) {
            super(400, "Solicitud inválida", detail);
        }
    }

    public static class CardNotFoundException extends DomainException {
        public CardNotFoundException(String detail) {
            super(404, "Tarjeta no encontrada", detail);
        }
    }

    public static class DuplicateRequestException extends DomainException {
        public DuplicateRequestException(String detail) {
            super(409, "Solicitud duplicada", detail);
        }
    }

    public static class ConcurrentUpdateException extends DomainException {
        public ConcurrentUpdateException(String detail) {
            super(409, "Conflicto de concurrencia", detail);
        }
    }

    public static class BusinessRuleException extends DomainException {
        public BusinessRuleException(String detail) {
            super(422, "Regla de negocio incumplida", detail);
        }
    }
}

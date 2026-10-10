package com.example.banking.notifications.domain;

/** Errores del dominio; la capa REST los traduce a problem+json. */
public abstract class DomainException extends RuntimeException {

    protected DomainException(String message) {
        super(message);
    }

    public static final class NotFound extends DomainException {
        public NotFound(String message) { super(message); }
    }

    public static final class AccessDenied extends DomainException {
        public AccessDenied(String message) { super(message); }
    }

    public static final class InvalidRequest extends DomainException {
        public InvalidRequest(String message) { super(message); }
    }

    public static final class MissingIdentity extends DomainException {
        public MissingIdentity(String message) { super(message); }
    }
}

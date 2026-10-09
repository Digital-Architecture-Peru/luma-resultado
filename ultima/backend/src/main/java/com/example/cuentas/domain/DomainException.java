package com.example.cuentas.domain;

/** Error de negocio tipado; la capa API lo traduce a un código HTTP. */
public class DomainException extends RuntimeException {

    public enum Kind { BUSINESS_RULE, NOT_FOUND, IDEMPOTENCY_CONFLICT }

    private final Kind kind;
    private final String code;

    private DomainException(Kind kind, String code, String message) {
        super(message);
        this.kind = kind;
        this.code = code;
    }

    public static DomainException businessRule(String code, String message) {
        return new DomainException(Kind.BUSINESS_RULE, code, message);
    }

    public static DomainException notFound(String code, String message) {
        return new DomainException(Kind.NOT_FOUND, code, message);
    }

    public static DomainException idempotencyConflict(String message) {
        return new DomainException(Kind.IDEMPOTENCY_CONFLICT, "IDEMPOTENCY_KEY_REUSED", message);
    }

    public Kind getKind() {
        return kind;
    }

    public String getCode() {
        return code;
    }
}

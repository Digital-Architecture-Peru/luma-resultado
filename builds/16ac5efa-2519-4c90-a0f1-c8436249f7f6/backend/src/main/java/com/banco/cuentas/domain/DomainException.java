package com.banco.cuentas.domain;

/** Error de negocio con la categoria que determina el codigo HTTP. */
public class DomainException extends RuntimeException {

    public enum Kind {
        VALIDATION(400, "Solicitud invalida"),
        NOT_FOUND(404, "No encontrado"),
        CONFLICT(409, "Conflicto"),
        UNPROCESSABLE(422, "Regla de negocio incumplida");

        private final int status;
        private final String title;

        Kind(int status, String title) {
            this.status = status;
            this.title = title;
        }

        public int status() {
            return status;
        }

        public String title() {
            return title;
        }
    }

    private final Kind kind;

    private DomainException(Kind kind, String message) {
        super(message);
        this.kind = kind;
    }

    public Kind kind() {
        return kind;
    }

    public static DomainException validation(String message) {
        return new DomainException(Kind.VALIDATION, message);
    }

    public static DomainException notFound(String message) {
        return new DomainException(Kind.NOT_FOUND, message);
    }

    public static DomainException conflict(String message) {
        return new DomainException(Kind.CONFLICT, message);
    }

    public static DomainException unprocessable(String message) {
        return new DomainException(Kind.UNPROCESSABLE, message);
    }
}

package com.banca.notificaciones.notification.domain;

/** Error de negocio con código HTTP y código estable para el cliente. */
public class DomainException extends RuntimeException {

    private final int status;
    private final String code;

    private DomainException(int status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public static DomainException badRequest(String message) {
        return new DomainException(400, "BAD_REQUEST", message);
    }

    public static DomainException notFound(String message) {
        return new DomainException(404, "NOT_FOUND", message);
    }

    public static DomainException conflict(String message) {
        return new DomainException(409, "CONFLICT", message);
    }

    public int getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }
}

package com.banco.cuentas.domain;

/** Error de negocio con el código HTTP y el identificador de problema que expone la API. */
public abstract class DomainException extends RuntimeException {

    private final int status;
    private final String code;

    protected DomainException(int status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public int status() {
        return status;
    }

    public String code() {
        return code;
    }
}

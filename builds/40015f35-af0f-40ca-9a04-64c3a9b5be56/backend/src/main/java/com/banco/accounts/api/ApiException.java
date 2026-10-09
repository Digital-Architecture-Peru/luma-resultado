package com.banco.accounts.api;

/** Error de negocio/entrada que se traduce a application/problem+json. */
public class ApiException extends RuntimeException {

    private final int status;
    private final String title;

    public ApiException(int status, String title, String detail) {
        super(detail);
        this.status = status;
        this.title = title;
    }

    public static ApiException badRequest(String detail) {
        return new ApiException(400, "Solicitud inválida", detail);
    }

    public static ApiException notFound(String detail) {
        return new ApiException(404, "No encontrado", detail);
    }

    public int status() {
        return status;
    }

    public String title() {
        return title;
    }
}

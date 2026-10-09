package com.banca.tarjetas.api.dto;

/** Cuerpo RFC 7807. */
public record ProblemDetail(String type, String title, int status, String detail) {

    public static ProblemDetail de(int status, String title, String detail) {
        return new ProblemDetail("about:blank", title, status, detail);
    }
}

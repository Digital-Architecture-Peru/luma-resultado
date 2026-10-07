package com.banca.internet.tarjetas.atoms;

/** Error de dominio: parámetros de consulta inválidos (HTTP 400). */
public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}

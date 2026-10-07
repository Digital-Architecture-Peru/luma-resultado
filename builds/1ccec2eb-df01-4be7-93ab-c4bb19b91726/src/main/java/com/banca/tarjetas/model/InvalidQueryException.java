package com.banca.tarjetas.model;

/** Parámetros de consulta inválidos (se traduce a 400). */
public class InvalidQueryException extends RuntimeException {
    public InvalidQueryException(String message) {
        super(message);
    }
}

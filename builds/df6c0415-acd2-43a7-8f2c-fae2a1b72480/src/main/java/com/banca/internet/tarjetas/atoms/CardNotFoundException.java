package com.banca.internet.tarjetas.atoms;

/** Error de dominio: tarjeta inexistente para el cliente (HTTP 404). */
public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException(long id) {
        super("Tarjeta no encontrada: " + id);
    }
}

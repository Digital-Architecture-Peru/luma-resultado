package com.banca.tarjetas.application;

/** La tarjeta no existe o no pertenece al cliente (no se distingue a propósito). */
public class TarjetaNoEncontradaException extends RuntimeException {

    public TarjetaNoEncontradaException() {
        super("Tarjeta no encontrada");
    }
}

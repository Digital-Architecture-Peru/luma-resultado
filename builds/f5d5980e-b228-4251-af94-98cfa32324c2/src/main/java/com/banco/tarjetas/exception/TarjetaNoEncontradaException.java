package com.banco.tarjetas.exception;

public class TarjetaNoEncontradaException extends RuntimeException {

    public TarjetaNoEncontradaException(String id) {
        super("No existe la tarjeta con id " + id);
    }
}

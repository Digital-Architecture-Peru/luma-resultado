package com.banco.tarjetas.service;

public class TarjetaNoEncontradaException extends RuntimeException {
    public TarjetaNoEncontradaException(String id) {
        super("No existe la tarjeta con id " + id);
    }
}

package com.banca.tarjetas.api;

public class ClienteInvalidoException extends RuntimeException {

    public ClienteInvalidoException(String mensaje) {
        super(mensaje);
    }
}

package com.banca.internet.cuentas.service;

import java.util.UUID;

public class CuentaNoEncontradaException extends RuntimeException {

    public CuentaNoEncontradaException(UUID id) {
        super("No existe la cuenta " + id + " para el cliente indicado");
    }
}

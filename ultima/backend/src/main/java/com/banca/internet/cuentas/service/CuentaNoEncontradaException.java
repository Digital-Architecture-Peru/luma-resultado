package com.banca.internet.cuentas.service;

/** La cuenta no existe o no pertenece al cliente (se responde igual para evitar IDOR). */
public class CuentaNoEncontradaException extends RuntimeException {

    public CuentaNoEncontradaException(long cuentaId) {
        super("No se encontró la cuenta " + cuentaId);
    }
}

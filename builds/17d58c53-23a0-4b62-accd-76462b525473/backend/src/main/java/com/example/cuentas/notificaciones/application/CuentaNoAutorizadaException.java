package com.example.cuentas.notificaciones.application;

public class CuentaNoAutorizadaException extends RuntimeException {

    public CuentaNoAutorizadaException() {
        super("No tiene acceso a la cuenta solicitada");
    }
}

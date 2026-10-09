package com.banco.pagos.application;

public class PagoNoEncontradoException extends RuntimeException {

    public PagoNoEncontradoException(long id) {
        super("Pago no encontrado: " + id);
    }
}

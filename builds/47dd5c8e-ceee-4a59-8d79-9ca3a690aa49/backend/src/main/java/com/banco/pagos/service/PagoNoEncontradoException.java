package com.banco.pagos.service;

import java.util.UUID;

public class PagoNoEncontradoException extends RuntimeException {

    public PagoNoEncontradoException(UUID id) {
        super("No existe el pago " + id);
    }
}

package com.demo.tarjetas.transaccion.domain;

/** La tarjeta no existe o no pertenece al cliente (HTTP 404). */
public class TarjetaNoEncontradaException extends DominioException {

    public TarjetaNoEncontradaException(long tarjetaId) {
        super("La tarjeta " + tarjetaId + " no existe para el cliente");
    }
}

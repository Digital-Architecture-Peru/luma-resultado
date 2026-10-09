package com.demo.tarjetas.transaccion.domain;

/** Base de los errores de dominio; la capa api los traduce a HTTP. */
public abstract class DominioException extends RuntimeException {

    protected DominioException(String mensaje) {
        super(mensaje);
    }
}

package com.demo.tarjetas.transaccion.domain;

/** Una regla de negocio o validacion de dominio no se cumple (HTTP 422). */
public class ReglaNegocioException extends DominioException {

    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}

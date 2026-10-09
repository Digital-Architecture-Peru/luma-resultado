package com.banco.pagos.domain;

/** Errores de dominio; la capa API los traduce a problem+json. */
public abstract class PagoException extends RuntimeException {

    protected PagoException(String mensaje) {
        super(mensaje);
    }

    /** Datos de entrada que violan las reglas del pago (HTTP 422). */
    public static final class Invalido extends PagoException {
        public Invalido(String mensaje) { super(mensaje); }
    }

    /** Pago inexistente (HTTP 404). */
    public static final class NoEncontrado extends PagoException {
        public NoEncontrado(String mensaje) { super(mensaje); }
    }

    /** Misma Idempotency-Key reutilizada con datos distintos (HTTP 409). */
    public static final class ConflictoIdempotencia extends PagoException {
        public ConflictoIdempotencia(String mensaje) { super(mensaje); }
    }
}

package com.banco.pagos.domain;

/** Estados de un pago. Solo PENDIENTE puede transicionar, y únicamente a un estado final. */
public enum EstadoPago {
    PENDIENTE,
    CONFIRMADO,
    RECHAZADO;

    public boolean puedeTransicionarA(EstadoPago destino) {
        return this == PENDIENTE && destino != PENDIENTE;
    }

    public EstadoPago transicionarA(EstadoPago destino) {
        if (!puedeTransicionarA(destino)) {
            throw new IllegalStateException("Transición no permitida: " + this + " -> " + destino);
        }
        return destino;
    }
}

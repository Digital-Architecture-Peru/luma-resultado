package com.demo.tarjetas.transaccion.domain;

/** Vista minima de una tarjeta: solo ultimos 4 digitos, nunca el PAN. */
public record TarjetaInfo(long id, String clienteId, String ultimos4, String tipo, String estado) {

    private static final String ACTIVA = "ACTIVA";

    public boolean estaActiva() {
        return ACTIVA.equals(estado);
    }

    public boolean perteneceA(String cliente) {
        return clienteId.equals(cliente);
    }
}

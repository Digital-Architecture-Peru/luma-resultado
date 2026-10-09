package com.banca.internet.cuentas.api;

/**
 * Identidad simulada del cliente mediante la cabecera X-Cliente-Id.
 * PENDIENTE: reemplazar por OIDC/JWT; esta cabecera no es un mecanismo de seguridad.
 */
final class ClienteIdHeader {

    static final String NOMBRE = "X-Cliente-Id";

    private ClienteIdHeader() {
    }

    static long parsear(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new SolicitudInvalidaException("Falta la cabecera " + NOMBRE);
        }
        try {
            long id = Long.parseLong(valor.trim());
            if (id <= 0) {
                throw new SolicitudInvalidaException("La cabecera " + NOMBRE + " debe ser positiva");
            }
            return id;
        } catch (NumberFormatException e) {
            throw new SolicitudInvalidaException("La cabecera " + NOMBRE + " no es numérica");
        }
    }
}

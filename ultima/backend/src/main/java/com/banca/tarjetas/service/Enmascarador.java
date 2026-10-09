package com.banca.tarjetas.service;

/** Construye la representación enmascarada de una tarjeta a partir de sus últimos 4 dígitos. */
public final class Enmascarador {

    private Enmascarador() {
    }

    public static String enmascarar(String ultimos4) {
        if (ultimos4 == null || !ultimos4.matches("\\d{4}")) {
            throw new IllegalArgumentException("ultimos4 debe tener exactamente 4 dígitos");
        }
        return "**** " + ultimos4;
    }
}

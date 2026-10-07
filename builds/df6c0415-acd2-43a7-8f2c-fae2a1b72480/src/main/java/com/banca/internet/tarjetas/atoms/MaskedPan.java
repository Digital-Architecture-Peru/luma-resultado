package com.banca.internet.tarjetas.atoms;

/** Atom: número de tarjeta enmascarado. Solo se conservan los últimos 4 dígitos. */
public record MaskedPan(String last4) {

    private static final String PREFIX = "**** **** **** ";

    public MaskedPan {
        if (last4 == null || !last4.matches("\\d{4}")) {
            throw new IllegalArgumentException("last4 debe tener exactamente 4 dígitos");
        }
    }

    public String display() {
        return PREFIX + last4;
    }
}

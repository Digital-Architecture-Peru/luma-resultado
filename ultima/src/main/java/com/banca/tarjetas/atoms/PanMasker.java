package com.banca.tarjetas.atoms;

/**
 * Átomo: enmascara un PAN dejando visibles solo los últimos 4 dígitos.
 * Función pura, sin dependencias.
 */
public final class PanMasker {

    private static final int VISIBLE_DIGITS = 4;
    private static final int MIN_LENGTH = 12;

    private PanMasker() {
    }

    public static String mask(String pan) {
        if (pan == null) {
            throw new IllegalArgumentException("El PAN es obligatorio");
        }
        String digits = pan.replaceAll("[\\s-]", "");
        if (!digits.matches("\\d{" + MIN_LENGTH + ",19}")) {
            throw new IllegalArgumentException("PAN con formato inválido");
        }
        String tail = digits.substring(digits.length() - VISIBLE_DIGITS);
        return "**** **** **** " + tail;
    }
}

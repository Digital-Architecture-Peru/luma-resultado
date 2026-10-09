package com.banco.cards.service;

/** Enmascara el PAN a partir de los últimos 4 dígitos; el PAN completo nunca se maneja. */
public final class PanMasker {

    private static final String MASK_PREFIX = "**** **** **** ";

    private PanMasker() {
    }

    public static String mask(String last4) {
        if (last4 == null || !last4.matches("\\d{4}")) {
            throw new IllegalArgumentException("Los últimos 4 dígitos deben ser numéricos");
        }
        return MASK_PREFIX + last4;
    }
}

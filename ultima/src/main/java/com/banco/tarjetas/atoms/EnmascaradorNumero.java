package com.banco.tarjetas.atoms;

/**
 * Atom: enmascara el número de tarjeta dejando visibles solo los últimos 4 dígitos.
 * Nunca se expone el PAN completo por la API.
 */
public final class EnmascaradorNumero {

    private static final int DIGITOS_VISIBLES = 4;
    private static final int LONGITUD_MINIMA = 12;
    private static final int LONGITUD_MAXIMA = 19;

    private EnmascaradorNumero() {
    }

    public static String enmascarar(String numero) {
        if (numero == null || !numero.matches("\\d+")) {
            throw new IllegalArgumentException("El número de tarjeta debe contener solo dígitos");
        }
        if (numero.length() < LONGITUD_MINIMA || numero.length() > LONGITUD_MAXIMA) {
            throw new IllegalArgumentException("Longitud de número de tarjeta inválida");
        }
        int ocultos = numero.length() - DIGITOS_VISIBLES;
        return "*".repeat(ocultos) + numero.substring(ocultos);
    }
}

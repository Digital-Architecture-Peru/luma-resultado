package com.banca.tarjetas.atoms;

import java.util.regex.Pattern;

/** Átomo: valida el formato del identificador de tarjeta (p. ej. CARD-001). */
public final class CardIdValidator {

    private static final Pattern FORMAT = Pattern.compile("^CARD-\\d{3,6}$");

    private CardIdValidator() {
    }

    public static boolean isValid(String id) {
        return id != null && FORMAT.matcher(id).matches();
    }
}

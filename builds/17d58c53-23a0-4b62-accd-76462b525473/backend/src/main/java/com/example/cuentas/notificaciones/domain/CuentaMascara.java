package com.example.cuentas.notificaciones.domain;

/** Enmascara números de cuenta para respuestas y logs (evita fuga de PII). */
public final class CuentaMascara {

    private static final int DIGITOS_VISIBLES = 4;

    private CuentaMascara() {
    }

    public static String enmascarar(String cuentaId) {
        if (cuentaId == null || cuentaId.length() <= DIGITOS_VISIBLES) {
            return "****";
        }
        return "****" + cuentaId.substring(cuentaId.length() - DIGITOS_VISIBLES);
    }
}

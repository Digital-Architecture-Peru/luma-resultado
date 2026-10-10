package com.example.cuentas.notificaciones.domain;

import java.math.BigDecimal;
import java.util.Objects;

public record Preferencia(
        String cuentaId,
        TipoEvento tipo,
        Canal canal,
        boolean activo,
        BigDecimal umbralMonto) {

    public Preferencia {
        Objects.requireNonNull(cuentaId, "cuentaId");
        Objects.requireNonNull(tipo, "tipo");
        Objects.requireNonNull(canal, "canal");
        if (umbralMonto != null && umbralMonto.signum() < 0) {
            throw new IllegalArgumentException("El umbral no puede ser negativo");
        }
    }

    /** Indica si un evento debe enviarse por este canal según tipo, estado y umbral. */
    public boolean aplicaA(TipoEvento evento, BigDecimal monto) {
        if (!activo || evento != tipo) {
            return false;
        }
        if (evento == TipoEvento.SALDO_BAJO || umbralMonto == null || monto == null) {
            return true;
        }
        return monto.compareTo(umbralMonto) >= 0;
    }
}

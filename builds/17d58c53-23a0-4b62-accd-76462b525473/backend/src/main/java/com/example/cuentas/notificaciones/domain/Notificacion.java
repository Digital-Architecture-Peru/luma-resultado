package com.example.cuentas.notificaciones.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record Notificacion(
        UUID id,
        String cuentaId,
        TipoEvento tipo,
        String mensaje,
        BigDecimal monto,
        boolean leida,
        Instant creadaEn) {

    public static final int MAX_MENSAJE = 255;

    public Notificacion {
        Objects.requireNonNull(id, "id");
        Objects.requireNonNull(cuentaId, "cuentaId");
        Objects.requireNonNull(tipo, "tipo");
        Objects.requireNonNull(creadaEn, "creadaEn");
        if (mensaje == null || mensaje.isBlank() || mensaje.length() > MAX_MENSAJE) {
            throw new IllegalArgumentException("El mensaje es obligatorio y admite hasta " + MAX_MENSAJE + " caracteres");
        }
    }

    public static Notificacion nueva(String cuentaId, TipoEvento tipo, String mensaje, BigDecimal monto) {
        return new Notificacion(UUID.randomUUID(), cuentaId, tipo, mensaje, monto, false, Instant.now());
    }

    public Notificacion comoLeida() {
        return new Notificacion(id, cuentaId, tipo, mensaje, monto, true, creadaEn);
    }
}

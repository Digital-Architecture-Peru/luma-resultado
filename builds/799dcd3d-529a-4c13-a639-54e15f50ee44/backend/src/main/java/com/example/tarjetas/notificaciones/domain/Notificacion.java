package com.example.tarjetas.notificaciones.domain;

import java.time.OffsetDateTime;

/** Notificación in-app de una tarjeta. Solo contiene los últimos 4 dígitos. */
public record Notificacion(
        long id,
        String tarjetaId,
        String ultimos4,
        TipoNotificacion tipo,
        String mensaje,
        boolean leida,
        OffsetDateTime creadaEn) {
}

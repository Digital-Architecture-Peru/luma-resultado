package com.example.tarjetas.notificaciones.api.dto;

import com.example.tarjetas.notificaciones.domain.Notificacion;
import java.time.OffsetDateTime;

public record NotificacionDto(
        long id,
        String tarjetaId,
        String ultimos4,
        String tipo,
        String mensaje,
        boolean leida,
        OffsetDateTime creadaEn) {

    public static NotificacionDto desde(Notificacion n) {
        return new NotificacionDto(n.id(), n.tarjetaId(), n.ultimos4(), n.tipo().name(),
                n.mensaje(), n.leida(), n.creadaEn());
    }
}

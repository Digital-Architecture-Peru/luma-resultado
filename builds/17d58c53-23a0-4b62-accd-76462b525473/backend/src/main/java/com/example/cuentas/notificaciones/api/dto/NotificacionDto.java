package com.example.cuentas.notificaciones.api.dto;

import com.example.cuentas.notificaciones.domain.CuentaMascara;
import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record NotificacionDto(
        UUID id,
        String cuenta,
        TipoEvento tipo,
        String mensaje,
        BigDecimal monto,
        boolean leida,
        Instant creadaEn) {

    public static NotificacionDto desde(Notificacion n) {
        return new NotificacionDto(n.id(), CuentaMascara.enmascarar(n.cuentaId()), n.tipo(),
                n.mensaje(), n.monto(), n.leida(), n.creadaEn());
    }
}

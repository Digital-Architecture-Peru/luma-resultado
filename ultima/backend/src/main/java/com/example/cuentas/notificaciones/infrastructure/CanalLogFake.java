package com.example.cuentas.notificaciones.infrastructure;

import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.CuentaMascara;
import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.port.CanalNotificacionPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador ficticio: solo registra la entrega con la cuenta enmascarada y sin monto. */
@Component
public class CanalLogFake implements CanalNotificacionPort {

    private static final Logger LOG = LoggerFactory.getLogger(CanalLogFake.class);

    @Override
    public void enviar(Notificacion notificacion, Canal canal) {
        LOG.info("Notificación {} ({}) enviada por {} a cuenta {}",
                notificacion.id(), notificacion.tipo(), canal, CuentaMascara.enmascarar(notificacion.cuentaId()));
    }
}

package com.example.cuentas.notificaciones.infrastructure.dispatch;

import com.example.cuentas.notificaciones.domain.AccountMask;
import com.example.cuentas.notificaciones.domain.Notification;
import com.example.cuentas.notificaciones.domain.ports.NotificationDispatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador no-op: la integración real de entrega está sin definir. No registra montos ni IDs completos. */
@Component
public class LoggingDispatcher implements NotificationDispatcher {

    private static final Logger LOG = LoggerFactory.getLogger(LoggingDispatcher.class);

    @Override
    public void dispatch(Notification notification) {
        LOG.info("Notificación {} generada para cuenta {}", notification.type(),
                AccountMask.mask(notification.accountId()));
    }
}

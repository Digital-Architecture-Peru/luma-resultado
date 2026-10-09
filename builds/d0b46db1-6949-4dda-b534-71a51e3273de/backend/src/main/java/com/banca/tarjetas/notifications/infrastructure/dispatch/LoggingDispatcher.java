package com.banca.tarjetas.notifications.infrastructure.dispatch;

import com.banca.tarjetas.notifications.application.port.NotificationDispatcher;
import com.banca.tarjetas.notifications.domain.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador provisional: no llama a sistemas externos. No registra el mensaje (datos sensibles). */
@Component
public class LoggingDispatcher implements NotificationDispatcher {

    private static final Logger log = LoggerFactory.getLogger(LoggingDispatcher.class);

    @Override
    public void dispatch(Notification notification) {
        log.info("Notificación {} tipo={} tarjeta=****{} lista para entrega",
                notification.id(), notification.type(), notification.last4());
    }
}

package com.banco.notifications.infrastructure.publisher;

import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador provisional: registra el evento sin datos sensibles. Sustituir al definirse la integración. */
@Component
public class LoggingNotificationPublisher implements NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(LoggingNotificationPublisher.class);

    @Override
    public void publishRead(Notification notification) {
        log.info("notification.read id={} type={}", notification.id(), notification.type());
    }
}

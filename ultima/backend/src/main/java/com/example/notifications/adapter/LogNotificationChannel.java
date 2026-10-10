package com.example.notifications.adapter;

import com.example.notifications.domain.Notification;
import com.example.notifications.port.NotificationChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador ficticio: solo registra el envío (sin datos sensibles). */
@Component
public class LogNotificationChannel implements NotificationChannel {

    private static final Logger LOG = LoggerFactory.getLogger(LogNotificationChannel.class);

    @Override
    public void send(Notification notification) {
        LOG.info("Notificación in-app id={} tipo={} referencia={}",
                notification.id(), notification.type(), notification.paymentReference());
    }
}

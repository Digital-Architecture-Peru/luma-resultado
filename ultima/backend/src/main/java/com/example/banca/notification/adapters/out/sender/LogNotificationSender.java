package com.example.banca.notification.adapters.out.sender;

import com.example.banca.notification.domain.Channel;
import com.example.banca.notification.domain.NotificationSender;
import com.example.banca.notification.domain.PaymentNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/** Adaptador simulado: solo registra el envío. No incluye datos de cuenta ni importes en el log. */
@Component
public class LogNotificationSender implements NotificationSender {

    private static final Logger LOG = LoggerFactory.getLogger(LogNotificationSender.class);

    @Override
    public void send(Channel channel, PaymentNotification notification) {
        LOG.info("Envio simulado canal={} notificationId={} evento={}",
                channel, notification.id(), notification.eventType());
    }
}

package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.NotificationChannel;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Clock;

/** Crea una notificación y la entrega por el canal configurado (in-app persistido por defecto). */
@ApplicationScoped
public class PublishNotification {

    private final NotificationChannel channel;
    private final Clock clock;

    /** Constructor de producción: ArC lo usa por estar anotado con {@code @Inject}. */
    @Inject
    public PublishNotification(NotificationChannel channel) {
        this(channel, Clock.systemUTC());
    }

    /** Constructor para pruebas con reloj fijo (no es candidato de inyección). */
    PublishNotification(NotificationChannel channel, Clock clock) {
        this.channel = channel;
        this.clock = clock;
    }

    public Notification execute(String accountId, NotificationType type, String title, String message) {
        Notification notification = Notification.unread(accountId, type, title, message, clock.instant());
        channel.deliver(notification);
        return notification;
    }
}

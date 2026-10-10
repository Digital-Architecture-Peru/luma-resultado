package com.example.banking.notifications.infrastructure.channel;

import com.example.banking.notifications.application.ports.NotificationChannel;
import com.example.banking.notifications.application.ports.NotificationRepository;
import com.example.banking.notifications.domain.Notification;
import jakarta.enterprise.context.ApplicationScoped;

/** Canal in-app: persiste la notificación. Canales externos quedan fuera de alcance. */
@ApplicationScoped
public class InAppChannel implements NotificationChannel {

    private final NotificationRepository repository;

    public InAppChannel(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deliver(Notification notification) {
        repository.save(notification);
    }
}

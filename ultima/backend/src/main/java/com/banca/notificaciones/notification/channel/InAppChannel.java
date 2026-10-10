package com.banca.notificaciones.notification.channel;

import com.banca.notificaciones.notification.domain.Notification;
import com.banca.notificaciones.notification.repository.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/** Entrega in-app: persiste la notificación para que la Banca por Internet la muestre. */
@ApplicationScoped
public class InAppChannel implements NotificationChannel {

    private final NotificationRepository repository;

    @Inject
    public InAppChannel(NotificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deliver(Notification notification) {
        repository.save(notification);
    }
}

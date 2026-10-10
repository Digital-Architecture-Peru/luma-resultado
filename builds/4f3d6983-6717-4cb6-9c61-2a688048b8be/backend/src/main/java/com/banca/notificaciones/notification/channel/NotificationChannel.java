package com.banca.notificaciones.notification.channel;

import com.banca.notificaciones.notification.domain.Notification;

/**
 * Canal de entrega. La integración real (email, SMS, push) está sin definir:
 * se añadiría como otra implementación de esta interfaz.
 */
public interface NotificationChannel {

    void deliver(Notification notification);
}

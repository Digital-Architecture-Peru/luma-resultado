package com.example.notifications.port;

import com.example.notifications.domain.Notification;

/** Puerto de entrega. La integración real (email, SMS, push) está sin definir. */
public interface NotificationChannel {

    void send(Notification notification);
}

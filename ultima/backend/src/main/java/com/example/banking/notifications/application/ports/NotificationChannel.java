package com.example.banking.notifications.application.ports;

import com.example.banking.notifications.domain.Notification;

/** Puerto de salida. La integración con canales externos (SMS, email, push) no está definida. */
public interface NotificationChannel {

    void deliver(Notification notification);
}

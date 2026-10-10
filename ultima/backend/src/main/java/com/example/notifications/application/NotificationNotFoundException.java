package com.example.notifications.application;

public class NotificationNotFoundException extends RuntimeException {

    public NotificationNotFoundException(long id) {
        super("Notificación no encontrada: " + id);
    }
}

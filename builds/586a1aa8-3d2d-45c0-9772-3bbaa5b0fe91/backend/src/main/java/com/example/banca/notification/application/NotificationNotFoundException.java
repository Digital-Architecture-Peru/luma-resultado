package com.example.banca.notification.application;

import java.util.UUID;

public class NotificationNotFoundException extends RuntimeException {

    public NotificationNotFoundException(UUID id) {
        super("No existe la notificación " + id + " para el cliente indicado");
    }
}

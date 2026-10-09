package com.banca.tarjetas.notifications.application;

import java.util.UUID;

public class NotificationNotFoundException extends RuntimeException {

    public NotificationNotFoundException(UUID id) {
        super("Notificación no encontrada: " + id);
    }
}

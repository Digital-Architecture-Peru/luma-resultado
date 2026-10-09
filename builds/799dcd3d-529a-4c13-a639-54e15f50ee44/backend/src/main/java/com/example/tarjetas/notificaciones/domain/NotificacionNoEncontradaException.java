package com.example.tarjetas.notificaciones.domain;

public class NotificacionNoEncontradaException extends RuntimeException {

    public NotificacionNoEncontradaException(long id) {
        super("No existe la notificación " + id);
    }
}

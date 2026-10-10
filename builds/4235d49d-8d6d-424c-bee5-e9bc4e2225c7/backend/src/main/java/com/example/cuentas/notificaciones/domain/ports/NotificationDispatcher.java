package com.example.cuentas.notificaciones.domain.ports;

import com.example.cuentas.notificaciones.domain.Notification;

/** Puerto de salida hacia el canal de entrega. La integración real está sin definir. */
public interface NotificationDispatcher {

    void dispatch(Notification notification);
}

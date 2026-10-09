package com.banca.tarjetas.notifications.application.port;

import com.banca.tarjetas.notifications.domain.Notification;

/** Puerto de integración (canal de entrega aún sin definir). */
public interface NotificationDispatcher {

    void dispatch(Notification notification);
}

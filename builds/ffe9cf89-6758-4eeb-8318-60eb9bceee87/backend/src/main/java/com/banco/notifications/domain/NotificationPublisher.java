package com.banco.notifications.domain;

/**
 * Puerto de integración externa (canal de entrega / eventos). El contrato real
 * no está definido: el adaptador actual solo registra el evento.
 */
public interface NotificationPublisher {

    void publishRead(Notification notification);
}

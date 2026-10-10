package com.example.banca.notification.domain;

/** Puerto de envío por canal externo. La integración real está sin definir. */
public interface NotificationSender {

    void send(Channel channel, PaymentNotification notification);
}

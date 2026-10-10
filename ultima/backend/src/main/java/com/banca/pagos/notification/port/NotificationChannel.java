package com.banca.pagos.notification.port;

import com.banca.pagos.notification.domain.PaymentNotification;

/** Puerto de canales de entrega (email, SMS, push). La integración real está sin definir. */
public interface NotificationChannel {

    void send(PaymentNotification notification);
}

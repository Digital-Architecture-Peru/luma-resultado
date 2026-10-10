package com.banca.pagos.notification.adapter;

import com.banca.pagos.notification.domain.PaymentNotification;
import com.banca.pagos.notification.port.NotificationChannel;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

/** Canal simulado: solo registra id y tipo, sin datos personales. */
@ApplicationScoped
public class FakeChannel implements NotificationChannel {

    private static final Logger LOG = Logger.getLogger(FakeChannel.class);

    @Override
    public void send(PaymentNotification notification) {
        LOG.infof("Canal simulado: notificación %s de tipo %s", notification.id(), notification.type());
    }
}

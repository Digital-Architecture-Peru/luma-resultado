package com.banco.payments.adapter.gateway;

import com.banco.payments.application.ports.PaymentGateway;
import com.banco.payments.domain.Payment;
import org.springframework.stereotype.Component;

/**
 * Adaptador ficticio y determinista: rechaza cuentas destino terminadas en "0000".
 * Se reemplaza por el adaptador real cuando se defina la integracion.
 */
@Component
public class FakePaymentGateway implements PaymentGateway {

    private static final String REJECTED_SUFFIX = "0000";

    @Override
    public boolean authorize(Payment payment) {
        return !payment.targetAccount().endsWith(REJECTED_SUFFIX);
    }
}

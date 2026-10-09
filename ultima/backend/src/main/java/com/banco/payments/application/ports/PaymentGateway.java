package com.banco.payments.application.ports;

import com.banco.payments.domain.Payment;

/** Puerto hacia el sistema que autoriza el pago. La integracion real aun no esta definida. */
public interface PaymentGateway {

    boolean authorize(Payment payment);
}

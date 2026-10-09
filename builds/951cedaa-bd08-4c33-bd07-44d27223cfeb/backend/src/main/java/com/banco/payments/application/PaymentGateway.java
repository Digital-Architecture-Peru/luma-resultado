package com.banco.payments.application;

import com.banco.payments.domain.Payment;

/** Puerto hacia el autorizador de pagos (integracion sin definir; hoy un stub local). */
public interface PaymentGateway {
    boolean authorize(Payment payment);
}

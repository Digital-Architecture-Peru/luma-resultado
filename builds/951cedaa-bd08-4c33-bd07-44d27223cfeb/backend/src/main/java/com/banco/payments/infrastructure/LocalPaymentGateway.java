package com.banco.payments.infrastructure;

import com.banco.payments.application.PaymentGateway;
import com.banco.payments.domain.Payment;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/** Stub local: rechaza importes por encima de un umbral (simula fondos insuficientes). */
@ApplicationScoped
public class LocalPaymentGateway implements PaymentGateway {

    private final BigDecimal declineAbove;

    public LocalPaymentGateway(
            @ConfigProperty(name = "payments.gateway.decline-above") BigDecimal declineAbove) {
        this.declineAbove = declineAbove;
    }

    @Override
    public boolean authorize(Payment payment) {
        return payment.amount().compareTo(declineAbove) <= 0;
    }
}

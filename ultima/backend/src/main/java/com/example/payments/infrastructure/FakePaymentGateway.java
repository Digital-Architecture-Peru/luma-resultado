package com.example.payments.infrastructure;

import com.example.payments.domain.Payment;
import com.example.payments.domain.PaymentGateway;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Adaptador ficticio: rechaza importes sobre un umbral para poder probar REJECTED. */
@Component
public class FakePaymentGateway implements PaymentGateway {

    private final BigDecimal limit;

    public FakePaymentGateway(@Value("${payments.gateway.fake-limit}") BigDecimal limit) {
        this.limit = limit;
    }

    @Override
    public GatewayDecision authorize(Payment payment) {
        if (payment.amount().isGreaterThan(limit)) {
            return GatewayDecision.reject("Importe superior al limite permitido");
        }
        return GatewayDecision.approve();
    }
}

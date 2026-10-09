package com.example.payments.domain;

/** Puerto de integracion con el sistema de pagos (contrato real sin definir). */
public interface PaymentGateway {

    GatewayDecision authorize(Payment payment);

    record GatewayDecision(boolean approved, String reason) {
        public static GatewayDecision approve() {
            return new GatewayDecision(true, null);
        }

        public static GatewayDecision reject(String reason) {
            return new GatewayDecision(false, reason);
        }
    }
}

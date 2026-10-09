package com.banco.payments.domain;

import java.util.UUID;

public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(UUID id) {
        super("Pago no encontrado: " + id);
    }
}

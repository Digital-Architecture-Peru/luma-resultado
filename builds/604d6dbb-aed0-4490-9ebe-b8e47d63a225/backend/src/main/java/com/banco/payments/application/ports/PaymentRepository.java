package com.banco.payments.application.ports;

import com.banco.payments.domain.Payment;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {

    Optional<Payment> findById(UUID id);

    Optional<Payment> findByIdempotencyKey(String idempotencyKey);

    Payment save(Payment payment);
}

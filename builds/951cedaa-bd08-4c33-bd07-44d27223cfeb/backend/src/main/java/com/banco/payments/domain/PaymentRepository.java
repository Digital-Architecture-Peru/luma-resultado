package com.banco.payments.domain;

import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia del dominio. */
public interface PaymentRepository {

    /** @throws DuplicateIdempotencyKeyException si la clave ya existe. */
    void save(Payment payment);

    Optional<Payment> findById(UUID id);

    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
}

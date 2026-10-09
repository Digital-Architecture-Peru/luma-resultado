package com.example.payments.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia. */
public interface PaymentRepository {

    /** @throws DuplicateIdempotencyKeyException si la clave ya existe. */
    void save(Payment payment);

    Optional<Payment> findById(UUID id);

    Optional<Payment> findByIdempotencyKey(String key);

    List<Payment> findBySourceAccount(String account, int page, int size);
}

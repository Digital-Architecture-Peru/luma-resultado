package com.example.cuentas.domain;

import java.util.Optional;

/** Puerto de persistencia de transferencias. */
public interface TransferRepository {

    Optional<Transfer> findByIdempotencyKey(String idempotencyKey);

    Transfer add(Transfer transfer);
}

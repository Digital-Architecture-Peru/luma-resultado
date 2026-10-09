package com.banco.cuentas.persistence;

import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.Transfer;
import java.util.List;
import java.util.Optional;

public interface TransferRepository {

    Optional<Transfer> findByIdempotencyKey(String idempotencyKey);

    void insert(Transfer transfer);

    void insertMovement(Movement movement);

    /** Movimientos de una cuenta, mas recientes primero. */
    List<Movement> findMovements(long accountId, int page, int size);
}

package com.banco.cuentas.repository;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.MovementType;
import com.banco.cuentas.domain.TransferReceipt;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia. La implementación de producción usa PostgreSQL vía JDBC. */
public interface AccountRepository {

    List<Account> findAll();

    boolean accountExists(long accountId);

    /** Devuelve las cuentas bloqueadas para escritura, ordenadas por id ascendente. */
    List<Account> lockByIds(List<Long> accountIds);

    void updateBalance(long accountId, BigDecimal newBalance);

    Optional<TransferReceipt> findTransferByKey(String idempotencyKey);

    void insertTransfer(TransferReceipt receipt);

    void insertMovement(long accountId, UUID transferId, MovementType type, BigDecimal amount, Instant at);

    /** Movimientos de una cuenta, del más reciente al más antiguo. */
    List<Movement> findMovements(long accountId);
}

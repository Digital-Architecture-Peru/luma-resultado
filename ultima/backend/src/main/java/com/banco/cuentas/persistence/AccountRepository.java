package com.banco.cuentas.persistence;

import com.banco.cuentas.domain.Account;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AccountRepository {

    List<Account> findByOwner(String ownerId);

    Optional<Account> findById(long id);

    /** Bloquea la fila hasta el fin de la transaccion (SELECT ... FOR UPDATE). */
    Optional<Account> findByIdForUpdate(long id);

    void updateBalance(long id, BigDecimal newBalance);
}

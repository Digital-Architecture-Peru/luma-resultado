package com.example.accounts.domain;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AccountRepository {

    List<Account> findByCustomer(long customerId);

    /** Lee y bloquea la cuenta (SELECT ... FOR UPDATE) dentro de la transacción en curso. */
    Optional<Account> findByIdForUpdate(long id);

    boolean existsForCustomer(long accountId, long customerId);

    void updateBalance(long id, BigDecimal newBalance);

    List<Movement> findMovements(long accountId, int page, int size);
}

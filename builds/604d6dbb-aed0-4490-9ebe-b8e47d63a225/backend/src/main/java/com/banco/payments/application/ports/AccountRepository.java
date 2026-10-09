package com.banco.payments.application.ports;

import com.banco.payments.domain.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository {

    Optional<Account> findById(UUID id);

    List<Account> findByCustomerId(String customerId);

    /** Guarda el nuevo saldo solo si la version persistida sigue siendo expectedVersion. */
    boolean updateBalance(Account updated, long expectedVersion);
}

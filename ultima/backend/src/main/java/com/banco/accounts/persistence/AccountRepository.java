package com.banco.accounts.persistence;

import com.banco.accounts.domain.Account;
import java.util.List;
import java.util.Optional;

/** Puerto de lectura de cuentas. Toda consulta se acota por cliente. */
public interface AccountRepository {

    List<Account> findByCustomerId(String customerId);

    Optional<Account> findByIdAndCustomerId(long id, String customerId);
}

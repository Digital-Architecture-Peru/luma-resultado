package com.banco.accounts.persistence;

import com.banco.accounts.domain.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de lectura. Todas las consultas filtran por cliente. */
public interface AccountRepository {

    List<Account> findByCustomer(String customerId, int limit, int offset);

    long countByCustomer(String customerId);

    Optional<Account> findByIdAndCustomer(UUID id, String customerId);
}

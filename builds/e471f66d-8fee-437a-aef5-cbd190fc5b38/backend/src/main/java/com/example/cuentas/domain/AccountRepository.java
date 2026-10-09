package com.example.cuentas.domain;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Puerto de persistencia de cuentas; lo implementa la capa infrastructure. */
public interface AccountRepository {

    List<Account> findByCustomerIdOrderByIdAsc(String customerId);

    Optional<Account> findById(Long id);

    /** Devuelve las cuentas con bloqueo pesimista, ordenadas por id para evitar interbloqueos. */
    List<Account> lockByIds(Collection<Long> ids);
}

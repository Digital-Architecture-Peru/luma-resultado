package com.example.cuentas.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** Puerto del libro de movimientos (usa Pageable de Spring Data por pragmatismo). */
public interface MovementRepository {

    Movement add(Movement movement);

    Page<Movement> findByAccountIdOrderByCreatedAtDescIdDesc(Long accountId, Pageable pageable);
}

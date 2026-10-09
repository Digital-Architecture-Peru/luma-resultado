package com.banca.internet.cuentas.repository;

import com.banca.internet.cuentas.domain.Cuenta;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas derivadas (parametrizadas por Spring Data); siempre filtran por cliente. */
public interface CuentaRepository extends JpaRepository<Cuenta, UUID> {

    Page<Cuenta> findByClienteId(String clienteId, Pageable pageable);

    Optional<Cuenta> findByIdAndClienteId(UUID id, String clienteId);
}

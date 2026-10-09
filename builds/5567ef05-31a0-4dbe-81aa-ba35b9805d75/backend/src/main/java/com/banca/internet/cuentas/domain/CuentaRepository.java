package com.banca.internet.cuentas.domain;

import java.util.List;
import java.util.Optional;

/** Puerto de persistencia: el servicio no conoce Panache ni PostgreSQL. */
public interface CuentaRepository {

    List<Cuenta> buscarPorCliente(long clienteId);

    Optional<Cuenta> buscarPorIdYCliente(long cuentaId, long clienteId);
}

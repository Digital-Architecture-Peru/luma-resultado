package com.banca.cuentas.persistence;

import com.banca.cuentas.domain.Cuenta;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CuentaRepository {

    List<Cuenta> buscarPorCliente(String clienteId);

    Optional<Cuenta> buscarPorId(UUID id);
}

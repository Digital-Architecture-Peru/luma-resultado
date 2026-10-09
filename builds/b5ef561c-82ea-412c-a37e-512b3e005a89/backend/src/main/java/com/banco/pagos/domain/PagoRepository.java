package com.banco.pagos.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia del agregado Pago. */
public interface PagoRepository {

    Pago guardar(Pago pago);

    Optional<Pago> buscarPorId(UUID id);

    Optional<Pago> buscarPorIdempotencyKey(String idempotencyKey);

    List<Pago> listarPorCuentaOrigen(String cuentaOrigen, int limite);
}

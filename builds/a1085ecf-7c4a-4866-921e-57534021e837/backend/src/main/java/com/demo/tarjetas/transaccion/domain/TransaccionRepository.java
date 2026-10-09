package com.demo.tarjetas.transaccion.domain;

import java.util.List;
import java.util.Optional;

/** Puerto de persistencia. */
public interface TransaccionRepository {

    Optional<TarjetaInfo> buscarTarjeta(long tarjetaId);

    List<TarjetaInfo> tarjetasDeCliente(String clienteId);

    Optional<Transaccion> buscarPorClave(String idempotencyKey);

    void guardar(Transaccion transaccion);

    List<Transaccion> historial(long tarjetaId, int limite);
}

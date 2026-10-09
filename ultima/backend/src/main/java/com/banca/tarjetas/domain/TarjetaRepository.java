package com.banca.tarjetas.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de lectura de tarjetas. */
public interface TarjetaRepository {

    List<Tarjeta> buscarPorCliente(UUID clienteId);

    Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId);
}

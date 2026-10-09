package com.banca.tarjetas.repository;

import com.banca.tarjetas.domain.Tarjeta;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de solo lectura. */
public interface TarjetaRepository {

    List<Tarjeta> listarPorCliente(UUID clienteId, int pagina, int tamano);

    long contarPorCliente(UUID clienteId);

    Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId);
}

package com.banco.tarjetas.repository;

import com.banco.tarjetas.model.Tarjeta;

import java.util.List;
import java.util.Optional;

/** Puerto de acceso a tarjetas; la integración real con el core bancario aún no está definida. */
public interface TarjetaRepository {

    List<Tarjeta> buscarTodas();

    Optional<Tarjeta> buscarPorId(String id);
}

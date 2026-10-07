package com.banco.tarjetas.repository;

import com.banco.tarjetas.model.Tarjeta;
import java.util.List;
import java.util.Optional;

/** Puerto de lectura de tarjetas; la integración real aún no está definida. */
public interface TarjetaRepository {

    List<Tarjeta> listar();

    Optional<Tarjeta> buscarPorId(String id);
}

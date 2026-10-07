package com.banco.tarjetas.repository;

import com.banco.tarjetas.model.Tarjeta;
import java.util.List;
import java.util.Optional;

/** Puerto de lectura de tarjetas; la integración real se define más adelante. */
public interface TarjetaRepository {
    List<Tarjeta> findAll();

    Optional<Tarjeta> findById(String id);
}

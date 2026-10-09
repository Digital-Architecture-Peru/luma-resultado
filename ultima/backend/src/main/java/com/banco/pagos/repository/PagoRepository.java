package com.banco.pagos.repository;

import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import java.util.List;
import java.util.Optional;

/** Puerto de lectura de pagos; el servicio depende de esta abstraccion, no de Panache. */
public interface PagoRepository {

    List<Pago> buscar(FiltroPagos filtro, int page, int size);

    long contar(FiltroPagos filtro);

    Optional<Pago> porId(Long id);
}

package com.banco.pagos.repository;

import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.Pagina;
import java.util.Optional;
import java.util.UUID;

/** Puerto de acceso a datos; la implementación vigente usa PostgreSQL. */
public interface PagoRepository {

    Pagina<Pago> listar(FiltroPagos filtro, int page, int size);

    Optional<Pago> buscarPorId(String clienteId, UUID id);
}

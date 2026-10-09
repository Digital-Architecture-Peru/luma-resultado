package com.banco.pagos.domain;

import java.util.Optional;

/** Puerto de persistencia: toda consulta se acota siempre a la cuenta del usuario. */
public interface PagoRepository {

    PaginaResultado<Pago> buscar(String cuentaId, PagoFiltro filtro, int page, int size);

    Optional<Pago> buscarPorId(String cuentaId, long id);
}

package com.banco.pagos.integration;

import com.banco.pagos.domain.Pago;
import java.util.List;

/**
 * Puerto para una futura integración con un sistema externo de pagos (aún sin definir).
 * Hoy solo existe un stub; no se llama a sistemas reales.
 */
public interface ConsultaPagosExternaPort {

    List<Pago> consultarPendientes(String clienteId);
}

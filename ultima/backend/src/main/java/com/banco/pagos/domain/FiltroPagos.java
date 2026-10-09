package com.banco.pagos.domain;

import java.time.Instant;

/** Criterios de busqueda ya validados. desde, hasta y estado son opcionales (null). */
public record FiltroPagos(String cuentaId, Instant desde, Instant hasta, EstadoPago estado) {
}

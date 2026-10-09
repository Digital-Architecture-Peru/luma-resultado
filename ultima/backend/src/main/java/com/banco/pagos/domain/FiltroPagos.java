package com.banco.pagos.domain;

import java.time.OffsetDateTime;

/** Filtros opcionales; {@code hasta} es exclusivo. */
public record FiltroPagos(String clienteId, EstadoPago estado, OffsetDateTime desde, OffsetDateTime hasta) {
}

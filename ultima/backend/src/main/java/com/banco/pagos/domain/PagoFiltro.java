package com.banco.pagos.domain;

import java.time.OffsetDateTime;

/**
 * Filtro de consulta. {@code desde} es inclusivo y {@code hastaExclusivo} es exclusivo;
 * cualquier campo nulo significa "sin restricción".
 */
public record PagoFiltro(OffsetDateTime desde, OffsetDateTime hastaExclusivo, EstadoPago estado) {
}

package com.banca.tarjetas.domain;

import java.math.BigDecimal;
import java.util.UUID;

/** Tarjeta de un cliente. Nunca contiene PAN completo, CVV ni fecha completa. */
public record Tarjeta(
        UUID id,
        UUID clienteId,
        String marca,
        String tipo,
        String ultimos4,
        EstadoTarjeta estado,
        BigDecimal limite,
        BigDecimal saldo,
        String moneda,
        String venceMesAnio) {
}

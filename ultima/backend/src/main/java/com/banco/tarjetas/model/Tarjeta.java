package com.banco.tarjetas.model;

import java.math.BigDecimal;

/** Tarjeta del cliente. Solo expone el número enmascarado (nunca el PAN completo). */
public record Tarjeta(
        String id,
        String numeroEnmascarado,
        String titular,
        TipoTarjeta tipo,
        EstadoTarjeta estado,
        String marca,
        BigDecimal limite,
        BigDecimal saldoDisponible,
        String vencimiento) {
}

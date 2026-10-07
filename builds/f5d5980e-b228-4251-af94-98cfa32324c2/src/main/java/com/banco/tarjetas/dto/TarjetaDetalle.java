package com.banco.tarjetas.dto;

import java.math.BigDecimal;

/** DTO de detalle; nunca incluye el número completo. */
public record TarjetaDetalle(
        String id,
        String numeroEnmascarado,
        String titular,
        String tipo,
        String estado,
        String moneda,
        BigDecimal limite,
        BigDecimal saldo,
        BigDecimal disponible,
        String vencimiento) {
}

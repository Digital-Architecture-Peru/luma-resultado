package com.banco.tarjetas.model;

import java.math.BigDecimal;

/**
 * Vista de consulta de una tarjeta. Nunca contiene el número completo ni el CVV:
 * solo el número enmascarado.
 */
public record Tarjeta(
        String id,
        String tipo,
        String marca,
        String numeroEnmascarado,
        String titular,
        EstadoTarjeta estado,
        BigDecimal limite,
        BigDecimal saldoDisponible,
        String vencimiento) {
}

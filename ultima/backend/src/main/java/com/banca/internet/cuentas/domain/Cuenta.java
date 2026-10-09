package com.banca.internet.cuentas.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Modelo de dominio inmutable de una cuenta bancaria. */
public record Cuenta(
        Long id,
        long clienteId,
        String numero,
        String tipo,
        String moneda,
        BigDecimal saldoDisponible,
        String estado,
        LocalDate fechaApertura) {
}

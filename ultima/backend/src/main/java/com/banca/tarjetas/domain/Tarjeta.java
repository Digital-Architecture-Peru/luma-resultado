package com.banca.tarjetas.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Tarjeta del cliente. Solo se conservan los últimos 4 dígitos del PAN. */
public record Tarjeta(
        UUID id,
        UUID clienteId,
        String ultimos4,
        String marca,
        Tipo tipo,
        Estado estado,
        String moneda,
        BigDecimal limiteCredito,
        BigDecimal saldoDisponible,
        LocalDate vencimiento) {

    public enum Tipo { CREDITO, DEBITO }

    public enum Estado { ACTIVA, BLOQUEADA, VENCIDA }
}

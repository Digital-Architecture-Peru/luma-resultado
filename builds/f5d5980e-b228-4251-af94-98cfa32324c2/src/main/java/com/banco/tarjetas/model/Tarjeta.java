package com.banco.tarjetas.model;

import com.banco.tarjetas.atoms.EstadoTarjeta;
import com.banco.tarjetas.atoms.TipoTarjeta;
import java.math.BigDecimal;
import java.time.YearMonth;

/** Modelo de dominio inmutable. Los datos son ficticios. */
public record Tarjeta(
        String id,
        String numero,
        String titular,
        TipoTarjeta tipo,
        EstadoTarjeta estado,
        String moneda,
        BigDecimal limite,
        BigDecimal saldo,
        YearMonth vencimiento) {
}

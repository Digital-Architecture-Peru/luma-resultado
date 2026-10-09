package com.banca.tarjetas.api.dto;

import com.banca.tarjetas.domain.Tarjeta;
import java.time.LocalDate;
import java.util.UUID;

/** Montos como texto decimal para no perder precisión en JSON. */
public record TarjetaResumenDto(
        UUID id,
        String ultimos4,
        String marca,
        String tipo,
        String estado,
        String moneda,
        String saldoDisponible,
        LocalDate vencimiento) {

    public static TarjetaResumenDto desde(Tarjeta t) {
        return new TarjetaResumenDto(t.id(), t.ultimos4(), t.marca(), t.tipo().name(),
                t.estado().name(), t.moneda(), t.saldoDisponible().toPlainString(), t.vencimiento());
    }
}

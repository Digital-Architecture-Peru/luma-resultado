package com.banca.tarjetas.api.dto;

import com.banca.tarjetas.domain.Tarjeta;
import java.time.LocalDate;
import java.util.UUID;

public record TarjetaDetalleDto(
        UUID id,
        String ultimos4,
        String marca,
        String tipo,
        String estado,
        String moneda,
        String limiteCredito,
        String saldoDisponible,
        LocalDate vencimiento) {

    public static TarjetaDetalleDto desde(Tarjeta t) {
        String limite = t.limiteCredito() == null ? null : t.limiteCredito().toPlainString();
        return new TarjetaDetalleDto(t.id(), t.ultimos4(), t.marca(), t.tipo().name(),
                t.estado().name(), t.moneda(), limite, t.saldoDisponible().toPlainString(),
                t.vencimiento());
    }
}

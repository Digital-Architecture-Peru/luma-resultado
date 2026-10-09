package com.banca.tarjetas.api;

import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.service.Enmascarador;
import java.math.BigDecimal;
import java.util.UUID;

/** Vista pública de una tarjeta: solo número enmascarado. */
public record TarjetaDto(
        UUID id,
        String marca,
        String tipo,
        String numeroEnmascarado,
        String estado,
        BigDecimal limite,
        BigDecimal saldo,
        String moneda,
        String venceMesAnio) {

    public static TarjetaDto desde(Tarjeta t) {
        return new TarjetaDto(
                t.id(),
                t.marca(),
                t.tipo(),
                Enmascarador.enmascarar(t.ultimos4()),
                t.estado().name(),
                t.limite(),
                t.saldo(),
                t.moneda(),
                t.venceMesAnio());
    }
}

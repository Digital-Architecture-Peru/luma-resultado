package com.demo.tarjetas.transaccion.api;

import com.demo.tarjetas.transaccion.domain.Transaccion;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransaccionRespuesta(
        UUID id, long tarjetaId, BigDecimal monto, String moneda, String estado, Instant creadoEn) {

    public static TransaccionRespuesta de(Transaccion t) {
        return new TransaccionRespuesta(t.id(), t.tarjetaId(), t.monto(), t.moneda(),
                t.estado().name(), t.creadoEn());
    }
}

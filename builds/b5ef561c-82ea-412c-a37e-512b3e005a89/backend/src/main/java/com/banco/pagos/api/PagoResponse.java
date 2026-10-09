package com.banco.pagos.api;

import com.banco.pagos.domain.Pago;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PagoResponse(UUID id, String cuentaOrigen, String cuentaDestino, BigDecimal monto,
                           String moneda, String estado, Instant creadoEn) {

    public static PagoResponse desde(Pago pago) {
        return new PagoResponse(pago.getId(), pago.getCuentaOrigen(), pago.getCuentaDestino(),
                pago.getMonto(), pago.getMoneda(), pago.getEstado().name(), pago.getCreadoEn());
    }
}

package com.banco.pagos.api;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record PagoDto(
        UUID id,
        String cuentaOrigenMask,
        String beneficiario,
        BigDecimal monto,
        String moneda,
        EstadoPago estado,
        OffsetDateTime fechaPago) {

    public static PagoDto desde(Pago pago) {
        return new PagoDto(pago.id(), pago.cuentaOrigenMask(), pago.beneficiario(), pago.monto(),
                pago.moneda(), pago.estado(), pago.fechaPago());
    }
}

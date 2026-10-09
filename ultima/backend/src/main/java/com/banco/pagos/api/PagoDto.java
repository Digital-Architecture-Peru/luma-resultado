package com.banco.pagos.api;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record PagoDto(
        long id,
        String cuenta,
        String beneficiario,
        String concepto,
        BigDecimal monto,
        String moneda,
        String estado,
        OffsetDateTime fechaPago) {
}

package com.banco.pagos.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record Pago(
        long id,
        String cuentaId,
        String numeroCuenta,
        String beneficiario,
        String concepto,
        BigDecimal monto,
        String moneda,
        EstadoPago estado,
        OffsetDateTime fechaPago) {
}

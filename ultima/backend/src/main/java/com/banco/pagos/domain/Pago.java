package com.banco.pagos.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Pago realizado por un cliente. La cuenta de origen llega ya enmascarada. */
public record Pago(
        UUID id,
        String clienteId,
        String cuentaOrigenMask,
        String beneficiario,
        BigDecimal monto,
        String moneda,
        EstadoPago estado,
        OffsetDateTime fechaPago) {
}

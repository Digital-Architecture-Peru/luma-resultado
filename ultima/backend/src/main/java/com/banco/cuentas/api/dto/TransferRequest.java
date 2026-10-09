package com.banco.cuentas.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;

/** Cuerpo de POST /api/v1/transfers. El monto llega como texto decimal. */
public record TransferRequest(
        Long sourceAccountId,
        Long targetAccountId,
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal amount,
        String currency,
        String description) {
}

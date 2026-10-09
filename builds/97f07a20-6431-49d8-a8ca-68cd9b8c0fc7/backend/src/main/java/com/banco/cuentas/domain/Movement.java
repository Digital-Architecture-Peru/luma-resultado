package com.banco.cuentas.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Movement(
        long id,
        long accountId,
        UUID transferId,
        MovementType type,
        @JsonFormat(shape = JsonFormat.Shape.STRING) BigDecimal amount,
        Instant createdAt) {
}

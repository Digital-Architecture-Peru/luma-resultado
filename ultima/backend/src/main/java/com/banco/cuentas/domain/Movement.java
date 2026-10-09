package com.banco.cuentas.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Asiento de una cuenta; {@code id} es null hasta que se persiste. */
public record Movement(Long id, long accountId, UUID transferId, Type type, BigDecimal amount, Instant createdAt) {

    public enum Type { DEBIT, CREDIT }
}

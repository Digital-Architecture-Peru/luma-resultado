package com.banco.cuentas.service;

import com.banco.cuentas.domain.TransferCommand;
import com.banco.cuentas.domain.ValidationException;
import java.math.BigDecimal;

/** Reglas de validación de entrada de una transferencia. */
public final class TransferValidator {

    static final int MAX_KEY_LENGTH = 64;
    static final int MAX_DESCRIPTION_LENGTH = 140;
    static final int MAX_DECIMALS = 2;

    private TransferValidator() {
    }

    public static void validate(TransferCommand cmd) {
        requireKey(cmd.idempotencyKey());
        if (cmd.sourceAccountId() == null || cmd.targetAccountId() == null) {
            throw new ValidationException("Las cuentas origen y destino son obligatorias.");
        }
        if (cmd.sourceAccountId().equals(cmd.targetAccountId())) {
            throw new ValidationException("La cuenta origen y la destino deben ser distintas.");
        }
        requireAmount(cmd.amount());
        if (cmd.currency() == null || !cmd.currency().matches("[A-Z]{3}")) {
            throw new ValidationException("La moneda debe ser un código ISO de 3 letras.");
        }
        if (cmd.description() != null && cmd.description().length() > MAX_DESCRIPTION_LENGTH) {
            throw new ValidationException("La descripción no puede superar " + MAX_DESCRIPTION_LENGTH
                    + " caracteres.");
        }
    }

    private static void requireKey(String key) {
        if (key == null || key.isBlank() || key.length() > MAX_KEY_LENGTH) {
            throw new ValidationException("La cabecera Idempotency-Key es obligatoria (máx. "
                    + MAX_KEY_LENGTH + " caracteres).");
        }
    }

    private static void requireAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new ValidationException("El monto debe ser mayor que cero.");
        }
        if (amount.stripTrailingZeros().scale() > MAX_DECIMALS) {
            throw new ValidationException("El monto admite como máximo " + MAX_DECIMALS + " decimales.");
        }
    }
}

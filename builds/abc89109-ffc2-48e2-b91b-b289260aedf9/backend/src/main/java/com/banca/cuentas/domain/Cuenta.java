package com.banca.cuentas.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record Cuenta(
        UUID id,
        String clienteId,
        String numero,
        TipoCuenta tipo,
        String moneda,
        BigDecimal saldoDisponible,
        BigDecimal saldoContable,
        EstadoCuenta estado,
        LocalDate fechaApertura,
        OffsetDateTime actualizadoEn) {

    private static final int DIGITOS_VISIBLES = 4;

    /** Devuelve el numero de cuenta mostrando solo los ultimos digitos (p. ej. ****1234). */
    public String numeroEnmascarado() {
        if (numero == null || numero.length() <= DIGITOS_VISIBLES) {
            return "****";
        }
        return "****" + numero.substring(numero.length() - DIGITOS_VISIBLES);
    }
}

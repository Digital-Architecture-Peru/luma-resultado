package com.banca.internet.cuentas.dto;

import com.banca.internet.cuentas.domain.EstadoCuenta;
import com.banca.internet.cuentas.domain.TipoCuenta;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CuentaDto(
        UUID id,
        String numeroEnmascarado,
        TipoCuenta tipo,
        String moneda,
        BigDecimal saldo,
        EstadoCuenta estado,
        LocalDate fechaApertura) {
}

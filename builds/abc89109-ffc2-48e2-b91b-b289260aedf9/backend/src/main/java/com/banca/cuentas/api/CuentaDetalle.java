package com.banca.cuentas.api;

import com.banca.cuentas.domain.Cuenta;
import com.banca.cuentas.domain.EstadoCuenta;
import com.banca.cuentas.domain.TipoCuenta;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CuentaDetalle(
        UUID id,
        String numeroEnmascarado,
        TipoCuenta tipo,
        String moneda,
        BigDecimal saldoDisponible,
        BigDecimal saldoContable,
        EstadoCuenta estado,
        LocalDate fechaApertura,
        OffsetDateTime actualizadoEn) {

    public static CuentaDetalle desde(Cuenta c) {
        return new CuentaDetalle(c.id(), c.numeroEnmascarado(), c.tipo(), c.moneda(),
                c.saldoDisponible(), c.saldoContable(), c.estado(), c.fechaApertura(), c.actualizadoEn());
    }
}

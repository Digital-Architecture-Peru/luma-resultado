package com.banca.cuentas.api;

import com.banca.cuentas.domain.Cuenta;
import com.banca.cuentas.domain.EstadoCuenta;
import com.banca.cuentas.domain.TipoCuenta;
import java.math.BigDecimal;
import java.util.UUID;

public record CuentaResumen(
        UUID id,
        String numeroEnmascarado,
        TipoCuenta tipo,
        String moneda,
        BigDecimal saldoDisponible,
        EstadoCuenta estado) {

    public static CuentaResumen desde(Cuenta c) {
        return new CuentaResumen(c.id(), c.numeroEnmascarado(), c.tipo(), c.moneda(),
                c.saldoDisponible(), c.estado());
    }
}

package com.banca.internet.cuentas.api;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.banca.internet.cuentas.domain.Cuenta;

/** Representación pública de la cuenta: el número va enmascarado y no se expone el cliente. */
public record CuentaDto(
        Long id,
        String numeroEnmascarado,
        String tipo,
        String moneda,
        BigDecimal saldoDisponible,
        String estado,
        LocalDate fechaApertura) {

    private static final int DIGITOS_VISIBLES = 4;
    private static final String MASCARA = "****";

    public static CuentaDto desde(Cuenta cuenta) {
        return new CuentaDto(cuenta.id(), enmascarar(cuenta.numero()), cuenta.tipo(), cuenta.moneda(),
                cuenta.saldoDisponible(), cuenta.estado(), cuenta.fechaApertura());
    }

    static String enmascarar(String numero) {
        if (numero == null || numero.length() <= DIGITOS_VISIBLES) {
            return MASCARA;
        }
        return MASCARA + numero.substring(numero.length() - DIGITOS_VISIBLES);
    }
}

package com.banco.pagos.api;

import com.banco.pagos.domain.Pago;

public final class PagoMapper {

    private static final int DIGITOS_VISIBLES = 4;

    private PagoMapper() {
    }

    public static PagoDto aDto(Pago pago) {
        return new PagoDto(
                pago.id(),
                enmascarar(pago.numeroCuenta()),
                pago.beneficiario(),
                pago.concepto(),
                pago.monto(),
                pago.moneda(),
                pago.estado().name(),
                pago.fechaPago());
    }

    static String enmascarar(String numeroCuenta) {
        if (numeroCuenta == null || numeroCuenta.length() <= DIGITOS_VISIBLES) {
            return "****";
        }
        return "****" + numeroCuenta.substring(numeroCuenta.length() - DIGITOS_VISIBLES);
    }
}

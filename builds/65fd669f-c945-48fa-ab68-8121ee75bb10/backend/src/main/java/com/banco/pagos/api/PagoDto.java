package com.banco.pagos.api;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import java.math.BigDecimal;
import java.time.Instant;

/** Vista publica del pago: la cuenta nunca sale completa. */
public record PagoDto(
        Long id,
        String cuentaEnmascarada,
        String beneficiario,
        String concepto,
        BigDecimal monto,
        String moneda,
        EstadoPago estado,
        Instant fechaPago) {

    private static final int DIGITOS_VISIBLES = 4;

    public static PagoDto desde(Pago p) {
        return new PagoDto(p.id, enmascarar(p.cuentaId), p.beneficiario, p.concepto,
                p.monto, p.moneda, p.estado, p.fechaPago);
    }

    static String enmascarar(String cuenta) {
        if (cuenta == null || cuenta.length() <= DIGITOS_VISIBLES) {
            return "****";
        }
        return "****" + cuenta.substring(cuenta.length() - DIGITOS_VISIBLES);
    }
}

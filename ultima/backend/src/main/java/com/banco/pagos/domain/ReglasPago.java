package com.banco.pagos.domain;

import java.math.BigDecimal;
import java.util.regex.Pattern;

/** Reglas de validación del pago (misma moneda, sin límites diarios ni OTP: ver hipótesis H3). */
public final class ReglasPago {

    public static final BigDecimal MONTO_MAXIMO = new BigDecimal("1000000.00");
    private static final Pattern CUENTA = Pattern.compile("^[A-Z0-9-]{8,34}$");
    private static final Pattern MONEDA = Pattern.compile("^[A-Z]{3}$");

    private ReglasPago() {
    }

    public static void validar(String origen, String destino, BigDecimal monto, String moneda) {
        validarCuenta("cuentaOrigen", origen);
        validarCuenta("cuentaDestino", destino);
        if (origen.equals(destino)) {
            throw new PagoException.Invalido("La cuenta de origen y destino deben ser distintas");
        }
        validarMonto(monto);
        if (moneda == null || !MONEDA.matcher(moneda).matches()) {
            throw new PagoException.Invalido("La moneda debe ser un código ISO-4217 de 3 letras mayúsculas");
        }
    }

    private static void validarCuenta(String campo, String valor) {
        if (valor == null || !CUENTA.matcher(valor).matches()) {
            throw new PagoException.Invalido(campo + " inválida: use 8 a 34 caracteres A-Z, 0-9 o guion");
        }
    }

    private static void validarMonto(BigDecimal monto) {
        if (monto == null || monto.signum() <= 0) {
            throw new PagoException.Invalido("El monto debe ser mayor que cero");
        }
        if (monto.stripTrailingZeros().scale() > 2) {
            throw new PagoException.Invalido("El monto admite máximo 2 decimales");
        }
        if (monto.compareTo(MONTO_MAXIMO) > 0) {
            throw new PagoException.Invalido("El monto excede el máximo permitido de " + MONTO_MAXIMO.toPlainString());
        }
    }
}

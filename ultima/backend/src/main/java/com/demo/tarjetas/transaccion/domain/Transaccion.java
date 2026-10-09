package com.demo.tarjetas.transaccion.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

/** Cargo o pago sobre una tarjeta. Inmutable; los montos usan BigDecimal. */
public record Transaccion(
        UUID id,
        long tarjetaId,
        BigDecimal monto,
        String moneda,
        EstadoTransaccion estado,
        String idempotencyKey,
        Instant creadoEn) {

    public static final BigDecimal MONTO_MAXIMO = new BigDecimal("1000000.00");
    private static final Pattern MONEDA_ISO = Pattern.compile("^[A-Z]{3}$");
    private static final Set<String> MONEDAS_SOPORTADAS = Set.of("USD", "EUR", "PEN");
    private static final int MAX_LONGITUD_CLAVE = 64;

    public static Transaccion nueva(long tarjetaId, BigDecimal monto, String moneda, String idempotencyKey) {
        validarMonto(monto);
        validarMoneda(moneda);
        validarClave(idempotencyKey);
        return new Transaccion(UUID.randomUUID(), tarjetaId, monto, moneda,
                EstadoTransaccion.PENDIENTE, idempotencyKey, Instant.now());
    }

    public Transaccion conEstado(EstadoTransaccion nuevoEstado) {
        return new Transaccion(id, tarjetaId, monto, moneda, nuevoEstado, idempotencyKey, creadoEn);
    }

    private static void validarMonto(BigDecimal monto) {
        if (monto == null || monto.signum() <= 0) {
            throw new ReglaNegocioException("El monto debe ser mayor que cero");
        }
        if (monto.scale() > 2) {
            throw new ReglaNegocioException("El monto admite maximo 2 decimales");
        }
        if (monto.compareTo(MONTO_MAXIMO) > 0) {
            throw new ReglaNegocioException("El monto excede el maximo permitido");
        }
    }

    private static void validarMoneda(String moneda) {
        if (moneda == null || !MONEDA_ISO.matcher(moneda).matches() || !MONEDAS_SOPORTADAS.contains(moneda)) {
            throw new ReglaNegocioException("Moneda no soportada. Use USD, EUR o PEN");
        }
    }

    private static void validarClave(String clave) {
        if (clave == null || clave.isBlank() || clave.length() > MAX_LONGITUD_CLAVE) {
            throw new ReglaNegocioException("Idempotency-Key es obligatoria (maximo 64 caracteres)");
        }
    }
}

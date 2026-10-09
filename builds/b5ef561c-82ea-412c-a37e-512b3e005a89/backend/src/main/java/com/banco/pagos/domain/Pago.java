package com.banco.pagos.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/** Agregado de pago. El estado solo cambia mediante confirmar() o rechazar(). */
public class Pago {

    private final UUID id;
    private final String idempotencyKey;
    private final String cuentaOrigen;
    private final String cuentaDestino;
    private final BigDecimal monto;
    private final String moneda;
    private final Instant creadoEn;
    private EstadoPago estado;

    public Pago(UUID id, String idempotencyKey, String cuentaOrigen, String cuentaDestino,
                BigDecimal monto, String moneda, EstadoPago estado, Instant creadoEn) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.monto = monto;
        this.moneda = moneda;
        this.estado = estado;
        this.creadoEn = creadoEn;
    }

    public static Pago nuevo(String idempotencyKey, String cuentaOrigen, String cuentaDestino,
                             BigDecimal monto, String moneda) {
        return new Pago(UUID.randomUUID(), idempotencyKey, cuentaOrigen, cuentaDestino,
                monto, moneda, EstadoPago.PENDIENTE, Instant.now());
    }

    public void confirmar() {
        estado = estado.transicionarA(EstadoPago.CONFIRMADO);
    }

    public void rechazar() {
        estado = estado.transicionarA(EstadoPago.RECHAZADO);
    }

    public boolean mismosDatosQue(String origen, String destino, BigDecimal otroMonto, String otraMoneda) {
        return cuentaOrigen.equals(origen) && cuentaDestino.equals(destino)
                && monto.compareTo(otroMonto) == 0 && moneda.equals(otraMoneda);
    }

    public UUID getId() { return id; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public String getCuentaOrigen() { return cuentaOrigen; }
    public String getCuentaDestino() { return cuentaDestino; }
    public BigDecimal getMonto() { return monto; }
    public String getMoneda() { return moneda; }
    public EstadoPago getEstado() { return estado; }
    public Instant getCreadoEn() { return creadoEn; }
}

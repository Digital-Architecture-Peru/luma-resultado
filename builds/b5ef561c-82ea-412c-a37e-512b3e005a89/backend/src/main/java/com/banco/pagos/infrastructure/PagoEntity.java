package com.banco.pagos.infrastructure;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pago")
public class PagoEntity {

    @Id
    @Column(name = "id")
    public UUID id;

    @Column(name = "idempotency_key", nullable = false, updatable = false)
    public String idempotencyKey;

    @Column(name = "cuenta_origen", nullable = false)
    public String cuentaOrigen;

    @Column(name = "cuenta_destino", nullable = false)
    public String cuentaDestino;

    @Column(name = "monto", nullable = false, precision = 19, scale = 2)
    public BigDecimal monto;

    @Column(name = "moneda", nullable = false, length = 3)
    public String moneda;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    public EstadoPago estado;

    @Column(name = "creado_en", nullable = false)
    public Instant creadoEn;

    public static PagoEntity desde(Pago pago) {
        PagoEntity e = new PagoEntity();
        e.id = pago.getId();
        e.idempotencyKey = pago.getIdempotencyKey();
        e.cuentaOrigen = pago.getCuentaOrigen();
        e.cuentaDestino = pago.getCuentaDestino();
        e.monto = pago.getMonto();
        e.moneda = pago.getMoneda();
        e.estado = pago.getEstado();
        e.creadoEn = pago.getCreadoEn();
        return e;
    }

    public Pago aDominio() {
        return new Pago(id, idempotencyKey, cuentaOrigen, cuentaDestino, monto, moneda, estado, creadoEn);
    }
}

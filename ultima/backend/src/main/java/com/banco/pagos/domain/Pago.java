package com.banco.pagos.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

/** Pago de solo lectura para la capacidad de consulta. */
@Entity
@Table(name = "pago")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "cuenta_id", nullable = false)
    public String cuentaId;

    @Column(nullable = false)
    public String beneficiario;

    @Column(nullable = false)
    public String concepto;

    @Column(nullable = false, precision = 18, scale = 2)
    public BigDecimal monto;

    @Column(nullable = false, length = 3)
    public String moneda;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public EstadoPago estado;

    @Column(name = "fecha_pago", nullable = false)
    public Instant fechaPago;
}

package com.banca.internet.cuentas.persistence;

import java.math.BigDecimal;
import java.time.LocalDate;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cuenta")
public class CuentaEntity extends PanacheEntityBase {

    @Id
    public Long id;

    @Column(name = "cliente_id", nullable = false)
    public long clienteId;

    @Column(nullable = false, unique = true)
    public String numero;

    @Column(nullable = false)
    public String tipo;

    @Column(nullable = false, length = 3)
    public String moneda;

    @Column(name = "saldo_disponible", nullable = false, precision = 18, scale = 2)
    public BigDecimal saldoDisponible;

    @Column(nullable = false)
    public String estado;

    @Column(name = "fecha_apertura", nullable = false)
    public LocalDate fechaApertura;
}

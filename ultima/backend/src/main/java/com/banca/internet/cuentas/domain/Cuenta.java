package com.banca.internet.cuentas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Entidad de solo lectura: nunca se expone fuera de la capa de servicio. */
@Entity
@Table(name = "cuenta")
public class Cuenta {

    @Id
    private UUID id;

    @Column(name = "cliente_id", nullable = false)
    private String clienteId;

    @Column(nullable = false, unique = true)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCuenta tipo;

    @Column(nullable = false, length = 3)
    private String moneda;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal saldo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuenta estado;

    @Column(name = "fecha_apertura", nullable = false)
    private LocalDate fechaApertura;

    protected Cuenta() {
        // requerido por JPA
    }

    public Cuenta(UUID id, String clienteId, String numero, TipoCuenta tipo, String moneda,
                  BigDecimal saldo, EstadoCuenta estado, LocalDate fechaApertura) {
        this.id = id;
        this.clienteId = clienteId;
        this.numero = numero;
        this.tipo = tipo;
        this.moneda = moneda;
        this.saldo = saldo;
        this.estado = estado;
        this.fechaApertura = fechaApertura;
    }

    public UUID getId() { return id; }
    public String getClienteId() { return clienteId; }
    public String getNumero() { return numero; }
    public TipoCuenta getTipo() { return tipo; }
    public String getMoneda() { return moneda; }
    public BigDecimal getSaldo() { return saldo; }
    public EstadoCuenta getEstado() { return estado; }
    public LocalDate getFechaApertura() { return fechaApertura; }
}

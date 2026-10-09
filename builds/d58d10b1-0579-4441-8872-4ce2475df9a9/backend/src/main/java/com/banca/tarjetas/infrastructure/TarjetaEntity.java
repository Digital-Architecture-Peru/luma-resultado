package com.banca.tarjetas.infrastructure;

import com.banca.tarjetas.domain.Tarjeta;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tarjeta")
public class TarjetaEntity {

    @Id
    public UUID id;

    @Column(name = "cliente_id", nullable = false)
    public UUID clienteId;

    @Column(nullable = false, length = 4)
    public String ultimos4;

    @Column(nullable = false)
    public String marca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Tarjeta.Tipo tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Tarjeta.Estado estado;

    @Column(nullable = false, length = 3)
    public String moneda;

    @Column(name = "limite_credito")
    public BigDecimal limiteCredito;

    @Column(name = "saldo_disponible", nullable = false)
    public BigDecimal saldoDisponible;

    @Column(nullable = false)
    public LocalDate vencimiento;

    public Tarjeta aDominio() {
        return new Tarjeta(id, clienteId, ultimos4, marca, tipo, estado, moneda,
                limiteCredito, saldoDisponible, vencimiento);
    }
}

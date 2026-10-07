package com.banco.tarjetas.repository;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/** Adaptador con datos ficticios en memoria (sin persistencia). */
@ApplicationScoped
public class DatosFicticiosTarjetaRepository implements TarjetaRepository {

    private static final List<Tarjeta> TARJETAS = List.of(
            new Tarjeta("tc-001", "CREDITO", "VISA", "**** **** **** 1111", "Ana Pérez Demo",
                    EstadoTarjeta.ACTIVA, new BigDecimal("5000.00"), new BigDecimal("3250.75"), "12/28"),
            new Tarjeta("td-002", "DEBITO", "MASTERCARD", "**** **** **** 2222", "Ana Pérez Demo",
                    EstadoTarjeta.ACTIVA, new BigDecimal("1500.00"), new BigDecimal("980.10"), "03/27"),
            new Tarjeta("tc-003", "CREDITO", "AMEX", "**** ****** *3333", "Luis Gómez Demo",
                    EstadoTarjeta.BLOQUEADA, new BigDecimal("8000.00"), new BigDecimal("8000.00"), "09/29"),
            new Tarjeta("td-004", "DEBITO", "VISA", "**** **** **** 4444", "Luis Gómez Demo",
                    EstadoTarjeta.VENCIDA, new BigDecimal("1000.00"), new BigDecimal("0.00"), "01/24"));

    @Override
    public List<Tarjeta> buscarTodas() {
        return TARJETAS;
    }

    @Override
    public Optional<Tarjeta> buscarPorId(String id) {
        return TARJETAS.stream().filter(t -> t.id().equals(id)).findFirst();
    }
}

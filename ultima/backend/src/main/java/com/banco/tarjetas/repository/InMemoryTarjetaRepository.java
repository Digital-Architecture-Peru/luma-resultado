package com.banco.tarjetas.repository;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.model.TipoTarjeta;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

/** Adaptador con datos ficticios en memoria (persistencia: no requiere). */
@Repository
public class InMemoryTarjetaRepository implements TarjetaRepository {

    private final List<Tarjeta> tarjetas = List.of(
            new Tarjeta("t-001", "**** **** **** 1234", "Ana Ejemplo", TipoTarjeta.CREDITO,
                    EstadoTarjeta.ACTIVA, "VISA", new BigDecimal("5000.00"), new BigDecimal("3200.50"), "08/28"),
            new Tarjeta("t-002", "**** **** **** 5678", "Ana Ejemplo", TipoTarjeta.DEBITO,
                    EstadoTarjeta.ACTIVA, "MASTERCARD", new BigDecimal("1500.00"), new BigDecimal("980.25"), "03/27"),
            new Tarjeta("t-003", "**** **** **** 9012", "Ana Ejemplo", TipoTarjeta.CREDITO,
                    EstadoTarjeta.BLOQUEADA, "VISA", new BigDecimal("2000.00"), new BigDecimal("0.00"), "11/26"),
            new Tarjeta("t-004", "**** **** **** 3456", "Ana Ejemplo", TipoTarjeta.DEBITO,
                    EstadoTarjeta.VENCIDA, "MASTERCARD", new BigDecimal("800.00"), new BigDecimal("0.00"), "01/24"));

    @Override
    public List<Tarjeta> findAll() {
        return tarjetas;
    }

    @Override
    public Optional<Tarjeta> findById(String id) {
        return tarjetas.stream().filter(t -> t.id().equals(id)).findFirst();
    }
}

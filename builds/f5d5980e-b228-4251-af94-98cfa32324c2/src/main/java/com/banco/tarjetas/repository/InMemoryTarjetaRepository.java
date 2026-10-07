package com.banco.tarjetas.repository;

import com.banco.tarjetas.atoms.EstadoTarjeta;
import com.banco.tarjetas.atoms.TipoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

/** Adaptador en memoria con datos ficticios (sin persistencia). */
@Repository
public class InMemoryTarjetaRepository implements TarjetaRepository {

    private final List<Tarjeta> tarjetas = List.of(
            new Tarjeta("TC-001", "4000000000001111", "Ana Ficticia", TipoTarjeta.CREDITO,
                    EstadoTarjeta.ACTIVA, "USD", new BigDecimal("5000.00"), new BigDecimal("1250.50"),
                    YearMonth.of(2029, 5)),
            new Tarjeta("TD-002", "5000000000002222", "Ana Ficticia", TipoTarjeta.DEBITO,
                    EstadoTarjeta.ACTIVA, "USD", BigDecimal.ZERO.setScale(2), new BigDecimal("830.25"),
                    YearMonth.of(2028, 11)),
            new Tarjeta("TC-003", "4000000000003333", "Ana Ficticia", TipoTarjeta.CREDITO,
                    EstadoTarjeta.BLOQUEADA, "USD", new BigDecimal("2000.00"), new BigDecimal("1999.99"),
                    YearMonth.of(2027, 2)),
            new Tarjeta("TD-004", "5000000000004444", "Ana Ficticia", TipoTarjeta.DEBITO,
                    EstadoTarjeta.VENCIDA, "USD", BigDecimal.ZERO.setScale(2), new BigDecimal("0.00"),
                    YearMonth.of(2024, 1)));

    @Override
    public List<Tarjeta> listar() {
        return tarjetas;
    }

    @Override
    public Optional<Tarjeta> buscarPorId(String id) {
        return tarjetas.stream().filter(t -> t.id().equals(id)).findFirst();
    }
}

package com.banca.tarjetas;

import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.domain.TarjetaRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Doble de prueba del puerto de persistencia. */
public class RepositorioEnMemoria implements TarjetaRepository {

    public static final UUID CLIENTE = UUID.fromString("11111111-1111-1111-1111-111111111111");
    public static final UUID OTRO_CLIENTE = UUID.fromString("22222222-2222-2222-2222-222222222222");
    public static final UUID TARJETA_CREDITO = UUID.fromString("aaaaaaaa-0000-0000-0000-000000000001");
    public static final UUID TARJETA_DEBITO = UUID.fromString("aaaaaaaa-0000-0000-0000-000000000002");

    private final List<Tarjeta> datos = List.of(
            new Tarjeta(TARJETA_CREDITO, CLIENTE, "4242", "VISA", Tarjeta.Tipo.CREDITO,
                    Tarjeta.Estado.ACTIVA, "USD", new BigDecimal("5000.00"),
                    new BigDecimal("3250.75"), LocalDate.of(2028, 11, 30)),
            new Tarjeta(TARJETA_DEBITO, CLIENTE, "1881", "MASTERCARD", Tarjeta.Tipo.DEBITO,
                    Tarjeta.Estado.ACTIVA, "USD", null,
                    new BigDecimal("1520.10"), LocalDate.of(2027, 6, 30)));

    @Override
    public List<Tarjeta> buscarPorCliente(UUID clienteId) {
        return datos.stream().filter(t -> t.clienteId().equals(clienteId)).toList();
    }

    @Override
    public Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId) {
        return datos.stream()
                .filter(t -> t.id().equals(id) && t.clienteId().equals(clienteId))
                .findFirst();
    }
}

package com.banco.tarjetas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.repository.InMemoryTarjetaRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class TarjetaServiceTest {

    private final TarjetaService service = new TarjetaService(new InMemoryTarjetaRepository());

    @Test
    void givenSinFiltro_whenListar_thenDevuelveTodas() {
        assertEquals(4, service.listar(Optional.empty()).size());
    }

    @Test
    void givenEstadoActiva_whenListar_thenSoloActivas() {
        List<Tarjeta> activas = service.listar(Optional.of(EstadoTarjeta.ACTIVA));
        assertEquals(2, activas.size());
        assertTrue(activas.stream().allMatch(t -> t.estado() == EstadoTarjeta.ACTIVA));
    }

    @Test
    void givenIdExistente_whenObtener_thenDevuelveTarjeta() {
        assertEquals("**** **** **** 1234", service.obtener("t-001").numeroEnmascarado());
    }

    @Test
    void givenIdInexistente_whenObtener_thenLanzaNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class, () -> service.obtener("x"));
    }
}

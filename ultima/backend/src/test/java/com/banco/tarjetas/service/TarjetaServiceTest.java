package com.banco.tarjetas.service;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.repository.DatosFicticiosTarjetaRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TarjetaServiceTest {

    private final TarjetaService servicio = new TarjetaService(new DatosFicticiosTarjetaRepository());

    @Test
    void givenSinFiltro_whenListar_thenDevuelveTodas() {
        assertEquals(4, servicio.listar(null).size());
        assertEquals(4, servicio.listar("  ").size());
    }

    @Test
    void givenEstadoActiva_whenListar_thenSoloActivas() {
        List<Tarjeta> activas = servicio.listar("activa");
        assertEquals(2, activas.size());
        assertTrue(activas.stream().allMatch(t -> t.estado() == EstadoTarjeta.ACTIVA));
    }

    @Test
    void givenEstadoDesconocido_whenListar_thenSolicitudInvalida() {
        assertThrows(SolicitudInvalidaException.class, () -> servicio.listar("xyz"));
    }

    @Test
    void givenIdExistente_whenObtener_thenDevuelveTarjetaEnmascarada() {
        Tarjeta t = servicio.obtener("tc-001");
        assertEquals("VISA", t.marca());
        assertTrue(t.numeroEnmascarado().endsWith("1111"));
        assertTrue(t.numeroEnmascarado().startsWith("****"));
    }

    @Test
    void givenIdInexistente_whenObtener_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class, () -> servicio.obtener("tc-999"));
    }

    @Test
    void givenIdMalformado_whenObtener_thenSolicitudInvalida() {
        assertThrows(SolicitudInvalidaException.class, () -> servicio.obtener("1 OR 1=1"));
    }
}

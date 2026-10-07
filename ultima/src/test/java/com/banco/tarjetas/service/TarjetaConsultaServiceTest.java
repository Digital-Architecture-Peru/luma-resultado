package com.banco.tarjetas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.tarjetas.dto.TarjetaDetalle;
import com.banco.tarjetas.dto.TarjetaResumen;
import com.banco.tarjetas.exception.TarjetaNoEncontradaException;
import com.banco.tarjetas.molecules.TarjetaMapper;
import com.banco.tarjetas.repository.InMemoryTarjetaRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class TarjetaConsultaServiceTest {

    private final TarjetaConsultaService servicio =
            new TarjetaConsultaService(new InMemoryTarjetaRepository(), new TarjetaMapper());

    @Test
    void givenSinFiltros_whenListar_thenDevuelveTodasEnmascaradas() {
        List<TarjetaResumen> res = servicio.listar(null, null);
        assertEquals(4, res.size());
        assertTrue(res.stream().allMatch(r -> r.numeroEnmascarado().startsWith("*")));
    }

    @Test
    void givenFiltroEstado_whenListar_thenSoloEseEstado() {
        List<TarjetaResumen> res = servicio.listar("activa", null);
        assertEquals(2, res.size());
        assertTrue(res.stream().allMatch(r -> r.estado().equals("ACTIVA")));
    }

    @Test
    void givenFiltroTipo_whenListar_thenSoloEseTipo() {
        List<TarjetaResumen> res = servicio.listar(null, "CREDITO");
        assertEquals(2, res.size());
        assertFalse(res.stream().anyMatch(r -> r.tipo().equals("DEBITO")));
    }

    @Test
    void givenFiltroInvalido_whenListar_thenLanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> servicio.listar("XYZ", null));
    }

    @Test
    void givenCredito_whenObtener_thenDisponibleEsLimiteMenosSaldo() {
        TarjetaDetalle d = servicio.obtener("TC-001");
        assertEquals(new BigDecimal("3749.50"), d.disponible());
        assertEquals("************1111", d.numeroEnmascarado());
        assertEquals("2029-05", d.vencimiento());
    }

    @Test
    void givenDebito_whenObtener_thenDisponibleEsSaldo() {
        assertEquals(new BigDecimal("830.25"), servicio.obtener("TD-002").disponible());
    }

    @Test
    void givenIdInexistente_whenObtener_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class, () -> servicio.obtener("TC-999"));
    }

    @Test
    void givenIdMalFormado_whenObtener_thenSolicitudInvalida() {
        assertThrows(IllegalArgumentException.class, () -> servicio.obtener("a b;drop"));
    }
}

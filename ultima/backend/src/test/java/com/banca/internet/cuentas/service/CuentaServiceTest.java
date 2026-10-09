package com.banca.internet.cuentas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.banca.internet.cuentas.domain.Cuenta;
import com.banca.internet.cuentas.domain.CuentaRepository;

class CuentaServiceTest {

    private static final long CLIENTE = 1L;
    private static final long OTRO_CLIENTE = 2L;

    private CuentaRepository repositorio;
    private CuentaService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(CuentaRepository.class);
        servicio = new CuentaService(repositorio);
    }

    private static Cuenta cuenta(long id, long clienteId) {
        return new Cuenta(id, clienteId, "19100000000011", "AHORROS", "PEN",
                new BigDecimal("10.00"), "ACTIVA", LocalDate.of(2021, 3, 15));
    }

    @Test
    void givenClienteSinCuentas_whenListar_thenDevuelveListaVacia() {
        when(repositorio.buscarPorCliente(CLIENTE)).thenReturn(List.of());

        assertTrue(servicio.listar(CLIENTE).isEmpty());
    }

    @Test
    void givenClienteConCuentas_whenListar_thenDevuelveSusCuentas() {
        when(repositorio.buscarPorCliente(CLIENTE)).thenReturn(List.of(cuenta(1, CLIENTE), cuenta(2, CLIENTE)));

        assertEquals(2, servicio.listar(CLIENTE).size());
    }

    @Test
    void givenCuentaInexistente_whenObtener_thenLanzaNoEncontrada() {
        when(repositorio.buscarPorIdYCliente(99L, CLIENTE)).thenReturn(Optional.empty());

        assertThrows(CuentaNoEncontradaException.class, () -> servicio.obtener(CLIENTE, 99L));
    }

    @Test
    void givenCuentaDeOtroCliente_whenObtener_thenLanzaNoEncontradaYFiltraPorCliente() {
        when(repositorio.buscarPorIdYCliente(4L, OTRO_CLIENTE)).thenReturn(Optional.of(cuenta(4, OTRO_CLIENTE)));
        when(repositorio.buscarPorIdYCliente(4L, CLIENTE)).thenReturn(Optional.empty());

        assertThrows(CuentaNoEncontradaException.class, () -> servicio.obtener(CLIENTE, 4L));
        verify(repositorio).buscarPorIdYCliente(4L, CLIENTE);
    }

    @Test
    void givenCuentaPropia_whenObtener_thenLaDevuelve() {
        Cuenta esperada = cuenta(1, CLIENTE);
        when(repositorio.buscarPorIdYCliente(1L, CLIENTE)).thenReturn(Optional.of(esperada));

        assertEquals(esperada, servicio.obtener(CLIENTE, 1L));
    }
}

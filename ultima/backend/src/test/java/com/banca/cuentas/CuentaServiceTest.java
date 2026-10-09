package com.banca.cuentas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.banca.cuentas.domain.Cuenta;
import com.banca.cuentas.domain.EstadoCuenta;
import com.banca.cuentas.domain.TipoCuenta;
import com.banca.cuentas.persistence.CuentaRepository;
import com.banca.cuentas.service.CuentaNoEncontradaException;
import com.banca.cuentas.service.CuentaService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CuentaServiceTest {

    private CuentaRepository repositorio;
    private CuentaService servicio;

    @BeforeEach
    void preparar() {
        repositorio = mock(CuentaRepository.class);
        servicio = new CuentaService(repositorio);
    }

    static Cuenta cuentaEjemplo(UUID id) {
        return new Cuenta(id, "CLI-001", "0010000000012345", TipoCuenta.AHORRO, "PEN",
                new BigDecimal("100.00"), new BigDecimal("120.00"), EstadoCuenta.ACTIVA,
                LocalDate.of(2021, 3, 15), OffsetDateTime.now());
    }

    @Test
    void givenClienteValido_whenListar_thenDevuelveCuentasDelRepositorio() {
        Cuenta cuenta = cuentaEjemplo(UUID.randomUUID());
        when(repositorio.buscarPorCliente("CLI-001")).thenReturn(List.of(cuenta));

        assertEquals(List.of(cuenta), servicio.listarPorCliente("CLI-001"));
    }

    @Test
    void givenClienteInvalido_whenListar_thenLanzaIllegalArgumentSinConsultar() {
        assertThrows(IllegalArgumentException.class, () -> servicio.listarPorCliente("x'; DROP TABLE cuenta;--"));
        assertThrows(IllegalArgumentException.class, () -> servicio.listarPorCliente(" "));
        verifyNoInteractions(repositorio);
    }

    @Test
    void givenIdInexistente_whenObtener_thenLanzaCuentaNoEncontrada() {
        UUID id = UUID.randomUUID();
        when(repositorio.buscarPorId(id)).thenReturn(Optional.empty());

        assertThrows(CuentaNoEncontradaException.class, () -> servicio.obtener(id));
    }

    @Test
    void givenIdExistente_whenObtener_thenDevuelveCuenta() {
        UUID id = UUID.randomUUID();
        Cuenta cuenta = cuentaEjemplo(id);
        when(repositorio.buscarPorId(id)).thenReturn(Optional.of(cuenta));

        assertEquals(cuenta, servicio.obtener(id));
    }

    @Test
    void givenNumeroCompleto_whenEnmascarar_thenMuestraSoloUltimosCuatroDigitos() {
        assertEquals("****2345", cuentaEjemplo(UUID.randomUUID()).numeroEnmascarado());
    }
}

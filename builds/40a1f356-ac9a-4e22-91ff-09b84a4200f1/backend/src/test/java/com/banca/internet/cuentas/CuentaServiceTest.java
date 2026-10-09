package com.banca.internet.cuentas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.banca.internet.cuentas.domain.Cuenta;
import com.banca.internet.cuentas.domain.EstadoCuenta;
import com.banca.internet.cuentas.domain.TipoCuenta;
import com.banca.internet.cuentas.dto.CuentaDto;
import com.banca.internet.cuentas.dto.PaginaCuentasDto;
import com.banca.internet.cuentas.repository.CuentaRepository;
import com.banca.internet.cuentas.service.CuentaNoEncontradaException;
import com.banca.internet.cuentas.service.CuentaService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class CuentaServiceTest {

    private static final String CLIENTE = "CLI-0001";
    private static final UUID ID = UUID.fromString("11111111-1111-4111-8111-111111111111");

    @Mock
    private CuentaRepository repository;

    private CuentaService service;

    @BeforeEach
    void preparar() {
        service = new CuentaService(repository);
    }

    private Cuenta cuenta() {
        return new Cuenta(ID, CLIENTE, "0011000000012345", TipoCuenta.AHORRO, "PEN",
                new BigDecimal("2540.75"), EstadoCuenta.ACTIVA, LocalDate.of(2021, 3, 15));
    }

    @Test
    void givenCuentasDelCliente_whenListar_thenEnmascaraNumeroYPagina() {
        when(repository.findByClienteId(any(String.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(cuenta())));

        PaginaCuentasDto pagina = service.listar(CLIENTE, 0, 20);

        assertEquals(1, pagina.totalElementos());
        assertEquals("****2345", pagina.contenido().get(0).numeroEnmascarado());
        assertEquals(new BigDecimal("2540.75"), pagina.contenido().get(0).saldo());
    }

    @Test
    void givenCuentaExistente_whenObtener_thenDevuelveDto() {
        when(repository.findByIdAndClienteId(ID, CLIENTE)).thenReturn(Optional.of(cuenta()));

        CuentaDto dto = service.obtener(CLIENTE, ID);

        assertEquals(ID, dto.id());
        assertEquals("PEN", dto.moneda());
        assertEquals(EstadoCuenta.ACTIVA, dto.estado());
    }

    @Test
    void givenCuentaDeOtroCliente_whenObtener_thenNoEncontrada() {
        when(repository.findByIdAndClienteId(ID, "CLI-9999")).thenReturn(Optional.empty());

        assertThrows(CuentaNoEncontradaException.class, () -> service.obtener("CLI-9999", ID));
    }

    @Test
    void givenClienteVacio_whenListar_thenLanzaIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.listar(" ", 0, 20));
    }
}

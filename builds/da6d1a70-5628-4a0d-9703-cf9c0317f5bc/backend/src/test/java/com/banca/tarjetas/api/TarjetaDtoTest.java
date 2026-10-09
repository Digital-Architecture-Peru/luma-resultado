package com.banca.tarjetas.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.banca.tarjetas.domain.EstadoTarjeta;
import com.banca.tarjetas.domain.Tarjeta;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class TarjetaDtoTest {

    @Test
    void givenTarjeta_whenAdaptarADto_thenSoloExponeNumeroEnmascarado() {
        Tarjeta t = new Tarjeta(UUID.randomUUID(), UUID.randomUUID(), "VISA", "CREDITO", "4242",
                EstadoTarjeta.BLOQUEADA, new BigDecimal("5000.00"), new BigDecimal("1.00"), "USD", "08/28");

        TarjetaDto dto = TarjetaDto.desde(t);

        assertEquals("**** 4242", dto.numeroEnmascarado());
        assertEquals("BLOQUEADA", dto.estado());
        assertFalse(dto.toString().contains("clienteId"));
    }
}

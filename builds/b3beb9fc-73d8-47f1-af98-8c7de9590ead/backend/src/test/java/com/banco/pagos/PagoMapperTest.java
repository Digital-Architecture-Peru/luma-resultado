package com.banco.pagos;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.banco.pagos.api.PagoDto;
import com.banco.pagos.api.PagoMapper;
import com.banco.pagos.domain.Pago;
import org.junit.jupiter.api.Test;

class PagoMapperTest {

    @Test
    void givenPago_whenADto_thenEnmascaraLaCuentaYConservaElMonto() {
        Pago pago = PagoServiceTest.pagoEjemplo();

        PagoDto dto = PagoMapper.aDto(pago);

        assertEquals("****1234", dto.cuenta());
        assertFalse(dto.cuenta().contains("0012"));
        assertEquals(pago.monto(), dto.monto());
        assertEquals("PROCESADO", dto.estado());
        assertEquals("USD", dto.moneda());
    }
}

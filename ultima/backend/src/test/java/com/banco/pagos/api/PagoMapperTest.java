package com.banco.pagos.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.service.ConsultaException;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.time.Instant;
import org.junit.jupiter.api.Test;

class PagoMapperTest {

    @Test
    void givenPago_whenMapear_thenEnmascaraCuentaYConservaCampos() {
        Pago p = new Pago();
        p.id = 3L;
        p.cuentaId = "0012345678901234";
        p.beneficiario = "Agua Demo";
        p.concepto = "Recibo";
        p.monto = new BigDecimal("32.15");
        p.moneda = "USD";
        p.estado = EstadoPago.PENDIENTE;
        p.fechaPago = Instant.parse("2026-09-07T09:30:00Z");

        PagoDto dto = PagoDto.desde(p);

        assertEquals("****1234", dto.cuentaEnmascarada());
        assertEquals(new BigDecimal("32.15"), dto.monto());
        assertEquals(EstadoPago.PENDIENTE, dto.estado());
    }

    @Test
    void givenCuentaCorta_whenEnmascarar_thenNoExponeDigitos() {
        assertEquals("****", PagoDto.enmascarar("123"));
        assertEquals("****", PagoDto.enmascarar(null));
    }

    @Test
    void givenTotalNoMultiplo_whenPaginar_thenRedondeaPaginasHaciaArriba() {
        assertEquals(3, PaginaDto.de(java.util.List.of(), 0, 10, 21).totalPaginas());
        assertEquals(0, PaginaDto.de(java.util.List.of(), 0, 10, 0).totalPaginas());
    }

    @Test
    void givenErrorDeDominio_whenMapear_thenProblemJson() {
        Response r = new ProblemMapper().toResponse(ConsultaException.noEncontrado("No existe"));

        assertEquals(404, r.getStatus());
        assertEquals("application/problem+json", r.getMediaType().toString());
        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> cuerpo = (java.util.Map<String, Object>) r.getEntity();
        assertEquals(404, cuerpo.get("status"));
        assertEquals("No existe", cuerpo.get("detail"));
    }
}

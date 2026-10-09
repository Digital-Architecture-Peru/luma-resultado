package com.banco.pagos.infrastructure;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.pagos.domain.Pago;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class PasarelaPagoStubTest {

    private final PasarelaPagoStub stub = new PasarelaPagoStub();

    private static Pago pago(String destino, String monto) {
        return Pago.nuevo("k", "0000-FAKE-0001", destino, new BigDecimal(monto), "USD");
    }

    @Test
    void givenPagoNormal_whenAutorizar_thenAprobado() {
        assertTrue(stub.autorizar(pago("0000-FAKE-0002", "100.00")).autorizado());
    }

    @Test
    void givenMontoSobreLimite_whenAutorizar_thenRechazado() {
        assertFalse(stub.autorizar(pago("0000-FAKE-0002", "50000.01")).autorizado());
    }

    @Test
    void givenDestinoTerminadoEnCeros_whenAutorizar_thenRechazado() {
        assertFalse(stub.autorizar(pago("0000-FAKE-0000", "10.00")).autorizado());
    }
}

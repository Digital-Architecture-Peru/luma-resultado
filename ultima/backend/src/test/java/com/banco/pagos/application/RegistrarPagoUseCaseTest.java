package com.banco.pagos.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.pagos.application.RegistrarPagoUseCase.Comando;
import com.banco.pagos.application.RegistrarPagoUseCase.Resultado;
import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoException;
import com.banco.pagos.domain.PasarelaPagoPort;
import com.banco.pagos.domain.PasarelaPagoPort.ResultadoPasarela;
import com.banco.pagos.support.InMemoryPagoRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RegistrarPagoUseCaseTest {

    private InMemoryPagoRepository repositorio;
    private PasarelaPagoPort pasarela;
    private RegistrarPagoUseCase useCase;

    @BeforeEach
    void preparar() {
        repositorio = new InMemoryPagoRepository();
        pasarela = mock(PasarelaPagoPort.class);
        useCase = new RegistrarPagoUseCase(repositorio, pasarela);
    }

    private static Comando comando(String clave, String monto) {
        return new Comando(clave, "0000-FAKE-0001", "0000-FAKE-0002", new BigDecimal(monto), "USD");
    }

    @Test
    void givenPasarelaAprueba_whenEjecutar_thenPagoConfirmadoYGuardado() {
        when(pasarela.autorizar(any(Pago.class))).thenReturn(ResultadoPasarela.aprobado());

        Resultado resultado = useCase.ejecutar(comando("k-1", "25.00"));

        assertTrue(resultado.creado());
        assertEquals(EstadoPago.CONFIRMADO, resultado.pago().getEstado());
        assertEquals(EstadoPago.CONFIRMADO,
                repositorio.buscarPorId(resultado.pago().getId()).orElseThrow().getEstado());
    }

    @Test
    void givenPasarelaRechaza_whenEjecutar_thenPagoRechazado() {
        when(pasarela.autorizar(any(Pago.class))).thenReturn(ResultadoPasarela.rechazado("fondos"));

        Resultado resultado = useCase.ejecutar(comando("k-2", "25.00"));

        assertEquals(EstadoPago.RECHAZADO, resultado.pago().getEstado());
    }

    @Test
    void givenMismaClaveYMismosDatos_whenEjecutarDosVeces_thenNoDuplicaNiLlamaPasarelaOtraVez() {
        when(pasarela.autorizar(any(Pago.class))).thenReturn(ResultadoPasarela.aprobado());

        Resultado primero = useCase.ejecutar(comando("k-3", "10.00"));
        Resultado segundo = useCase.ejecutar(comando("k-3", "10"));

        assertFalse(segundo.creado());
        assertSame(primero.pago(), segundo.pago());
        verify(pasarela, times(1)).autorizar(any(Pago.class));
    }

    @Test
    void givenMismaClaveYDatosDistintos_whenEjecutar_thenConflicto() {
        when(pasarela.autorizar(any(Pago.class))).thenReturn(ResultadoPasarela.aprobado());
        useCase.ejecutar(comando("k-4", "10.00"));

        assertThrows(PagoException.ConflictoIdempotencia.class, () -> useCase.ejecutar(comando("k-4", "11.00")));
    }

    @Test
    void givenClaveVacia_whenEjecutar_thenInvalido() {
        assertThrows(PagoException.Invalido.class, () -> useCase.ejecutar(comando(" ", "10.00")));
        assertThrows(PagoException.Invalido.class, () -> useCase.ejecutar(comando(null, "10.00")));
    }

    @Test
    void givenMontoInvalido_whenEjecutar_thenNoPersisteNiLlamaPasarela() {
        assertThrows(PagoException.Invalido.class, () -> useCase.ejecutar(comando("k-5", "0")));
        assertEquals(0, repositorio.guardados);
        verify(pasarela, times(0)).autorizar(any(Pago.class));
    }
}

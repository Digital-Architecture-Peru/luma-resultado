package com.demo.tarjetas.transaccion.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.demo.tarjetas.transaccion.domain.EstadoTransaccion;
import com.demo.tarjetas.transaccion.domain.ReglaNegocioException;
import com.demo.tarjetas.transaccion.domain.TarjetaInfo;
import com.demo.tarjetas.transaccion.domain.TarjetaNoEncontradaException;
import com.demo.tarjetas.transaccion.domain.Transaccion;
import com.demo.tarjetas.transaccion.domain.TransaccionRepository;
import com.demo.tarjetas.transaccion.infrastructure.StubProcesadorGateway;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RegistrarTransaccionServiceTest {

    private static final String CLIENTE = "cli-001";

    private FakeRepositorio repo;
    private RegistrarTransaccionService servicio;

    @BeforeEach
    void preparar() {
        repo = new FakeRepositorio();
        repo.tarjetas.add(new TarjetaInfo(1L, CLIENTE, "1111", "DEBITO", "ACTIVA"));
        repo.tarjetas.add(new TarjetaInfo(2L, CLIENTE, "3333", "CREDITO", "BLOQUEADA"));
        repo.tarjetas.add(new TarjetaInfo(3L, "cli-002", "4444", "DEBITO", "ACTIVA"));
        servicio = new RegistrarTransaccionService(repo, new StubProcesadorGateway(new BigDecimal("5000.00")));
    }

    @Test
    void givenMontoDentroDelLimite_whenRegistrar_thenAprobadaYGuardada() {
        ResultadoRegistro r = servicio.registrar(CLIENTE, 1L, new BigDecimal("100.00"), "USD", "k-1");

        assertFalse(r.repetida());
        assertEquals(EstadoTransaccion.APROBADA, r.transaccion().estado());
        assertEquals(1, repo.transacciones.size());
    }

    @Test
    void givenMontoSobreElLimite_whenRegistrar_thenRechazada() {
        ResultadoRegistro r = servicio.registrar(CLIENTE, 1L, new BigDecimal("5000.01"), "USD", "k-2");

        assertEquals(EstadoTransaccion.RECHAZADA, r.transaccion().estado());
    }

    @Test
    void givenMismaClave_whenRegistrarDosVeces_thenSegundaEsRepeticionSinDuplicar() {
        ResultadoRegistro primera = servicio.registrar(CLIENTE, 1L, new BigDecimal("10.00"), "USD", "k-3");
        ResultadoRegistro segunda = servicio.registrar(CLIENTE, 1L, new BigDecimal("10.00"), "USD", "k-3");

        assertTrue(segunda.repetida());
        assertEquals(primera.transaccion().id(), segunda.transaccion().id());
        assertEquals(1, repo.transacciones.size());
    }

    @Test
    void givenClaveDeOtraTarjeta_whenRegistrar_thenReglaNegocio() {
        servicio.registrar(CLIENTE, 1L, new BigDecimal("10.00"), "USD", "k-4");
        repo.tarjetas.add(new TarjetaInfo(9L, CLIENTE, "9999", "DEBITO", "ACTIVA"));

        assertThrows(ReglaNegocioException.class,
                () -> servicio.registrar(CLIENTE, 9L, new BigDecimal("10.00"), "USD", "k-4"));
    }

    @Test
    void givenTarjetaDeOtroCliente_whenRegistrar_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class,
                () -> servicio.registrar(CLIENTE, 3L, BigDecimal.TEN, "USD", "k-5"));
    }

    @Test
    void givenTarjetaInexistente_whenRegistrar_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class,
                () -> servicio.registrar(CLIENTE, 99L, BigDecimal.TEN, "USD", "k-6"));
    }

    @Test
    void givenTarjetaBloqueada_whenRegistrar_thenReglaNegocioYNadaGuardado() {
        assertThrows(ReglaNegocioException.class,
                () -> servicio.registrar(CLIENTE, 2L, BigDecimal.TEN, "USD", "k-7"));
        assertTrue(repo.transacciones.isEmpty());
    }

    @Test
    void givenMontoInvalido_whenRegistrar_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> servicio.registrar(CLIENTE, 1L, new BigDecimal("-1"), "USD", "k-8"));
    }

    @Test
    void givenSinClave_whenRegistrar_thenReglaNegocio() {
        assertThrows(ReglaNegocioException.class,
                () -> servicio.registrar(CLIENTE, 1L, BigDecimal.TEN, "USD", null));
    }

    @Test
    void givenVariasTransacciones_whenHistorialConLimite_thenRespetaLimite() {
        servicio.registrar(CLIENTE, 1L, BigDecimal.ONE, "USD", "a");
        servicio.registrar(CLIENTE, 1L, BigDecimal.TEN, "USD", "b");
        servicio.registrar(CLIENTE, 1L, BigDecimal.TEN, "USD", "c");

        assertEquals(2, servicio.historial(CLIENTE, 1L, 2).size());
    }

    @Test
    void givenTarjetaAjena_whenHistorial_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class, () -> servicio.historial(CLIENTE, 3L, 10));
    }

    @Test
    void givenCliente_whenTarjetas_thenSoloLasSuyas() {
        assertEquals(2, servicio.tarjetas(CLIENTE).size());
    }

    @Test
    void givenStub_whenMontoIgualAlLimite_thenAprueba() {
        StubProcesadorGateway stub = new StubProcesadorGateway(new BigDecimal("50.00"));
        TarjetaInfo t = repo.tarjetas.get(0);

        assertSame(EstadoTransaccion.APROBADA, stub.autorizar(t, new BigDecimal("50.00"), "USD"));
        assertSame(EstadoTransaccion.RECHAZADA, stub.autorizar(t, new BigDecimal("50.01"), "USD"));
    }

    /** Doble en memoria del puerto de persistencia. */
    private static final class FakeRepositorio implements TransaccionRepository {
        final List<TarjetaInfo> tarjetas = new ArrayList<>();
        final List<Transaccion> transacciones = new ArrayList<>();

        @Override
        public Optional<TarjetaInfo> buscarTarjeta(long id) {
            return tarjetas.stream().filter(t -> t.id() == id).findFirst();
        }

        @Override
        public List<TarjetaInfo> tarjetasDeCliente(String clienteId) {
            return tarjetas.stream().filter(t -> t.perteneceA(clienteId)).toList();
        }

        @Override
        public Optional<Transaccion> buscarPorClave(String clave) {
            return transacciones.stream().filter(t -> t.idempotencyKey().equals(clave)).findFirst();
        }

        @Override
        public void guardar(Transaccion t) {
            transacciones.add(t);
        }

        @Override
        public List<Transaccion> historial(long tarjetaId, int limite) {
            return transacciones.stream()
                    .filter(t -> t.tarjetaId() == tarjetaId)
                    .sorted(Comparator.comparing(Transaccion::creadoEn).reversed())
                    .limit(limite)
                    .toList();
        }
    }
}

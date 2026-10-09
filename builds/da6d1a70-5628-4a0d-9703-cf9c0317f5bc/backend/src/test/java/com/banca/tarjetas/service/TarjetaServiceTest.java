package com.banca.tarjetas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banca.tarjetas.domain.ErrorNegocio;
import com.banca.tarjetas.domain.EstadoTarjeta;
import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.repository.TarjetaRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class TarjetaServiceTest {

    private static final UUID CLIENTE = UUID.fromString("00000000-0000-4000-8000-000000000001");
    private static final UUID OTRO = UUID.fromString("00000000-0000-4000-8000-000000000002");

    private final Tarjeta visa = nueva("11111111-1111-4111-8111-111111111111", CLIENTE, "4242");
    private final Tarjeta ajena = nueva("44444444-4444-4444-8444-444444444444", OTRO, "9999");

    /** Doble en memoria del puerto de persistencia. */
    private final TarjetaRepository repo = new TarjetaRepository() {
        private final List<Tarjeta> datos = List.of(visa, ajena);

        @Override
        public List<Tarjeta> listarPorCliente(UUID clienteId, int pagina, int tamano) {
            return datos.stream().filter(t -> t.clienteId().equals(clienteId))
                    .skip((long) pagina * tamano).limit(tamano).toList();
        }

        @Override
        public long contarPorCliente(UUID clienteId) {
            return datos.stream().filter(t -> t.clienteId().equals(clienteId)).count();
        }

        @Override
        public Optional<Tarjeta> buscarPorIdYCliente(UUID id, UUID clienteId) {
            return datos.stream().filter(t -> t.id().equals(id) && t.clienteId().equals(clienteId)).findFirst();
        }
    };

    private final TarjetaService servicio = new TarjetaService(repo);

    @Test
    void givenCliente_whenListar_thenSoloSusTarjetas() {
        TarjetaService.Pagina p = servicio.listar(CLIENTE, 0, 20);
        assertEquals(List.of(visa), p.items());
        assertEquals(1L, p.total());
    }

    @Test
    void givenClienteSinTarjetas_whenListar_thenVacio() {
        TarjetaService.Pagina p = servicio.listar(UUID.randomUUID(), 0, 20);
        assertEquals(0, p.items().size());
        assertEquals(0L, p.total());
    }

    @Test
    void givenTamanoFueraDeRango_whenListar_thenSolicitudInvalida() {
        ErrorNegocio e = assertThrows(ErrorNegocio.class, () -> servicio.listar(CLIENTE, 0, 51));
        assertEquals(400, e.estadoHttp());
    }

    @Test
    void givenPaginaNegativa_whenListar_thenSolicitudInvalida() {
        ErrorNegocio e = assertThrows(ErrorNegocio.class, () -> servicio.listar(CLIENTE, -1, 10));
        assertEquals("SOLICITUD_INVALIDA", e.codigo());
    }

    @Test
    void givenTarjetaPropia_whenObtener_thenLaDevuelve() {
        assertEquals(visa, servicio.obtener(visa.id(), CLIENTE));
    }

    @Test
    void givenTarjetaInexistente_whenObtener_thenNoEncontrada() {
        ErrorNegocio e = assertThrows(ErrorNegocio.class, () -> servicio.obtener(UUID.randomUUID(), CLIENTE));
        assertEquals(404, e.estadoHttp());
    }

    @Test
    void givenTarjetaAjena_whenObtener_thenNoEncontrada() {
        ErrorNegocio e = assertThrows(ErrorNegocio.class, () -> servicio.obtener(ajena.id(), CLIENTE));
        assertEquals("TARJETA_NO_ENCONTRADA", e.codigo());
    }

    private static Tarjeta nueva(String id, UUID cliente, String ultimos4) {
        return new Tarjeta(UUID.fromString(id), cliente, "VISA", "CREDITO", ultimos4, EstadoTarjeta.ACTIVA,
                new BigDecimal("1000.00"), new BigDecimal("10.00"), "USD", "08/28");
    }
}

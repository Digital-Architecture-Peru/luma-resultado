package com.banca.tarjetas;

import static com.banca.tarjetas.RepositorioEnMemoria.CLIENTE;
import static com.banca.tarjetas.RepositorioEnMemoria.OTRO_CLIENTE;
import static com.banca.tarjetas.RepositorioEnMemoria.TARJETA_CREDITO;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banca.tarjetas.application.ConsultaTarjetasService;
import com.banca.tarjetas.application.TarjetaNoEncontradaException;
import com.banca.tarjetas.domain.Tarjeta;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ConsultaTarjetasServiceTest {

    private final ConsultaTarjetasService servicio =
            new ConsultaTarjetasService(new RepositorioEnMemoria());

    @Test
    void givenClienteConTarjetas_whenListar_thenDevuelveSoloLasSuyas() {
        assertEquals(2, servicio.listar(CLIENTE).size());
    }

    @Test
    void givenClienteSinTarjetas_whenListar_thenListaVacia() {
        assertTrue(servicio.listar(UUID.randomUUID()).isEmpty());
    }

    @Test
    void givenTarjetaPropia_whenDetalle_thenDevuelveTarjeta() {
        Tarjeta t = servicio.detalle(CLIENTE, TARJETA_CREDITO);
        assertEquals("4242", t.ultimos4());
    }

    @Test
    void givenTarjetaDeOtroCliente_whenDetalle_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class,
                () -> servicio.detalle(OTRO_CLIENTE, TARJETA_CREDITO));
    }

    @Test
    void givenTarjetaInexistente_whenDetalle_thenNoEncontrada() {
        assertThrows(TarjetaNoEncontradaException.class,
                () -> servicio.detalle(CLIENTE, UUID.randomUUID()));
    }
}

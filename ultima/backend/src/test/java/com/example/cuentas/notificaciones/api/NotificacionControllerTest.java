package com.example.cuentas.notificaciones.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cuentas.notificaciones.application.CuentaNoAutorizadaException;
import com.example.cuentas.notificaciones.application.NotificacionService;
import com.example.cuentas.notificaciones.application.PreferenciaService;
import com.example.cuentas.notificaciones.application.RecursoNoEncontradoException;
import com.example.cuentas.notificaciones.domain.Canal;
import com.example.cuentas.notificaciones.domain.Notificacion;
import com.example.cuentas.notificaciones.domain.Pagina;
import com.example.cuentas.notificaciones.domain.Preferencia;
import com.example.cuentas.notificaciones.domain.TipoEvento;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class NotificacionControllerTest {

    private static final String CUENTA = "0011223344";

    private NotificacionService notificaciones;
    private PreferenciaService preferencias;
    private MockMvc mvc;

    @BeforeEach
    void preparar() {
        notificaciones = mock(NotificacionService.class);
        preferencias = mock(PreferenciaService.class);
        mvc = MockMvcBuilders.standaloneSetup(new NotificacionController(notificaciones, preferencias))
                .setControllerAdvice(new ManejadorErrores())
                .build();
    }

    private Notificacion ejemplo(UUID id, boolean leida) {
        return new Notificacion(id, CUENTA, TipoEvento.ABONO, "Abono recibido",
                new BigDecimal("10.00"), leida, Instant.parse("2026-01-01T10:00:00Z"));
    }

    @Test
    void givenNotificaciones_whenGetLista_thenDevuelve200ConCuentaEnmascarada() throws Exception {
        when(notificaciones.listar(CUENTA, false, 0, 20))
                .thenReturn(new Pagina<>(List.of(ejemplo(UUID.randomUUID(), false)), 0, 20, 1));

        mvc.perform(get("/api/v1/cuentas/{id}/notificaciones", CUENTA).param("leida", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.contenido[0].cuenta").value("****3344"))
                .andExpect(jsonPath("$.contenido[0].leida").value(false));
    }

    @Test
    void givenCuentaAjena_whenGetLista_thenDevuelve403() throws Exception {
        when(notificaciones.listar(any(), any(), org.mockito.ArgumentMatchers.anyInt(),
                org.mockito.ArgumentMatchers.anyInt())).thenThrow(new CuentaNoAutorizadaException());

        mvc.perform(get("/api/v1/cuentas/{id}/notificaciones", "9999999999"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.title").value("Acceso denegado"));
    }

    @Test
    void givenPaginacionInvalida_whenGetLista_thenDevuelve400() throws Exception {
        when(notificaciones.listar(CUENTA, null, 0, 500)).thenThrow(new IllegalArgumentException("Paginación inválida"));

        mvc.perform(get("/api/v1/cuentas/{id}/notificaciones", CUENTA).param("size", "500"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenIdExistente_whenPatchLectura_thenDevuelveLeida() throws Exception {
        UUID id = UUID.randomUUID();
        when(notificaciones.marcarLeida(id)).thenReturn(ejemplo(id, true));

        mvc.perform(patch("/api/v1/notificaciones/{id}/lectura", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.leida").value(true));
    }

    @Test
    void givenIdInexistente_whenPatchLectura_thenDevuelve404() throws Exception {
        UUID id = UUID.randomUUID();
        when(notificaciones.marcarLeida(id)).thenThrow(new RecursoNoEncontradoException("no existe"));

        mvc.perform(patch("/api/v1/notificaciones/{id}/lectura", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void givenIdMalformado_whenPatchLectura_thenDevuelve400() throws Exception {
        mvc.perform(patch("/api/v1/notificaciones/{id}/lectura", "no-es-uuid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenPreferencias_whenGet_thenDevuelveLista() throws Exception {
        when(preferencias.listar(CUENTA)).thenReturn(
                List.of(new Preferencia(CUENTA, TipoEvento.CARGO, Canal.SMS, true, new BigDecimal("200.00"))));

        mvc.perform(get("/api/v1/cuentas/{id}/preferencias-notificacion", CUENTA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].canal").value("SMS"))
                .andExpect(jsonPath("$[0].activo").value(true));
    }

    @Test
    void givenCuerpoValido_whenPutPreferencia_thenDevuelve200() throws Exception {
        when(preferencias.actualizar(any())).thenAnswer(inv -> inv.getArgument(0));

        mvc.perform(put("/api/v1/cuentas/{id}/preferencias-notificacion", CUENTA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tipo\":\"ABONO\",\"canal\":\"APP\",\"activo\":false,\"umbralMonto\":10}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(false))
                .andExpect(jsonPath("$.tipo").value("ABONO"));
    }

    @Test
    void givenCuerpoSinCanal_whenPutPreferencia_thenDevuelve422() throws Exception {
        mvc.perform(put("/api/v1/cuentas/{id}/preferencias-notificacion", CUENTA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tipo\":\"ABONO\",\"activo\":true}"))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void givenEnumInvalido_whenPutPreferencia_thenDevuelve400() throws Exception {
        mvc.perform(put("/api/v1/cuentas/{id}/preferencias-notificacion", CUENTA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tipo\":\"OTRO\",\"canal\":\"APP\",\"activo\":true}"))
                .andExpect(status().isBadRequest());
    }
}

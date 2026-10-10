package com.example.cuentas.notificaciones.api;

import com.example.cuentas.notificaciones.api.dto.NotificacionDto;
import com.example.cuentas.notificaciones.api.dto.PaginaDto;
import com.example.cuentas.notificaciones.api.dto.PreferenciaDto;
import com.example.cuentas.notificaciones.application.NotificacionService;
import com.example.cuentas.notificaciones.application.PreferenciaService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class NotificacionController {

    private final NotificacionService notificaciones;
    private final PreferenciaService preferencias;

    public NotificacionController(NotificacionService notificaciones, PreferenciaService preferencias) {
        this.notificaciones = notificaciones;
        this.preferencias = preferencias;
    }

    @GetMapping("/cuentas/{cuentaId}/notificaciones")
    public PaginaDto<NotificacionDto> listar(@PathVariable String cuentaId,
                                             @RequestParam(required = false) Boolean leida,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size) {
        return PaginaDto.desde(notificaciones.listar(cuentaId, leida, page, size), NotificacionDto::desde);
    }

    @PatchMapping("/notificaciones/{id}/lectura")
    public NotificacionDto marcarLeida(@PathVariable UUID id) {
        return NotificacionDto.desde(notificaciones.marcarLeida(id));
    }

    @GetMapping("/cuentas/{cuentaId}/preferencias-notificacion")
    public List<PreferenciaDto> obtenerPreferencias(@PathVariable String cuentaId) {
        return preferencias.listar(cuentaId).stream().map(PreferenciaDto::desde).toList();
    }

    @PutMapping("/cuentas/{cuentaId}/preferencias-notificacion")
    public PreferenciaDto actualizarPreferencia(@PathVariable String cuentaId,
                                                @Valid @RequestBody PreferenciaDto cuerpo) {
        return PreferenciaDto.desde(preferencias.actualizar(cuerpo.aDominio(cuentaId)));
    }
}

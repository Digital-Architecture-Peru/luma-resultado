package com.banca.cuentas.api;

import com.banca.cuentas.service.CuentaService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cuentas")
public class CuentaController {

    private final CuentaService servicio;

    public CuentaController(CuentaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<CuentaResumen> listar(@RequestParam String clienteId) {
        return servicio.listarPorCliente(clienteId).stream().map(CuentaResumen::desde).toList();
    }

    @GetMapping("/{cuentaId}")
    public CuentaDetalle detalle(@PathVariable UUID cuentaId) {
        return CuentaDetalle.desde(servicio.obtener(cuentaId));
    }
}

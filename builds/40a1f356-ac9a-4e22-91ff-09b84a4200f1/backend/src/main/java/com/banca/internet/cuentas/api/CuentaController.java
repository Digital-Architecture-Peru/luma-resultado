package com.banca.internet.cuentas.api;

import com.banca.internet.cuentas.dto.CuentaDto;
import com.banca.internet.cuentas.dto.PaginaCuentasDto;
import com.banca.internet.cuentas.service.CuentaService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.UUID;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** El clienteId llega por cabecera como stub hasta integrar la identidad real. */
@RestController
@RequestMapping("/api/v1/cuentas")
@Validated
public class CuentaController {

    static final String CABECERA_CLIENTE = "X-Cliente-Id";

    private final CuentaService servicio;

    public CuentaController(CuentaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public PaginaCuentasDto listar(
            @RequestHeader(CABECERA_CLIENTE) String clienteId,
            @RequestParam(defaultValue = "0") @Min(0) int pagina,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int tamanio) {
        return servicio.listar(clienteId, pagina, tamanio);
    }

    @GetMapping("/{id}")
    public CuentaDto obtener(
            @RequestHeader(CABECERA_CLIENTE) String clienteId,
            @PathVariable UUID id) {
        return servicio.obtener(clienteId, id);
    }
}

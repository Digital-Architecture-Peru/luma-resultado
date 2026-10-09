package com.banco.pagos.api;

import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.Pagina;
import com.banco.pagos.service.PagoService;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Solo lectura. ADVERTENCIA: el cliente se toma del header simulado X-Cliente-Id;
 * debe reemplazarse por la identidad autenticada de Banca por Internet.
 */
@RestController
@RequestMapping("/api/v1/pagos")
public class PagoController {

    static final String HEADER_CLIENTE = "X-Cliente-Id";

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    @GetMapping
    public Pagina<PagoDto> listar(
            @RequestHeader(HEADER_CLIENTE) String clienteId,
            @RequestParam(required = false) EstadoPago estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.listar(clienteId, estado, desde, hasta, page, size).mapear(PagoDto::desde);
    }

    @GetMapping("/{id}")
    public PagoDto obtener(@RequestHeader(HEADER_CLIENTE) String clienteId, @PathVariable UUID id) {
        return PagoDto.desde(service.obtener(clienteId, id));
    }
}

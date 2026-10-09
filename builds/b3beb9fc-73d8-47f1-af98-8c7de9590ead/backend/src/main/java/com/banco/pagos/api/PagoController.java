package com.banco.pagos.api;

import com.banco.pagos.application.PagoService;
import com.banco.pagos.domain.EstadoPago;
import com.banco.pagos.domain.PaginaResultado;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/pagos")
public class PagoController {

    private final PagoService servicio;
    private final CuentaActualProvider cuentaActual;

    public PagoController(PagoService servicio, CuentaActualProvider cuentaActual) {
        this.servicio = servicio;
        this.cuentaActual = cuentaActual;
    }

    @GetMapping
    public PaginaResultado<PagoDto> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) EstadoPago estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return servicio.consultar(cuentaActual.cuentaId(), desde, hasta, estado, page, size)
                .map(PagoMapper::aDto);
    }

    @GetMapping("/{id}")
    public PagoDto detalle(@PathVariable long id) {
        return PagoMapper.aDto(servicio.obtener(cuentaActual.cuentaId(), id));
    }
}

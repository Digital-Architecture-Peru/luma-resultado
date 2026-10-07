package com.banco.tarjetas.controller;

import com.banco.tarjetas.dto.TarjetaDetalle;
import com.banco.tarjetas.dto.TarjetaResumen;
import com.banco.tarjetas.service.TarjetaConsultaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Capa de entrada REST de solo lectura: /v1/tarjetas. */
@RestController
@RequestMapping("/v1/tarjetas")
public class TarjetaController {

    private final TarjetaConsultaService servicio;

    public TarjetaController(TarjetaConsultaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<TarjetaResumen> listar(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tipo) {
        return servicio.listar(estado, tipo);
    }

    @GetMapping("/{id}")
    public TarjetaDetalle obtener(@PathVariable String id) {
        return servicio.obtener(id);
    }
}

package com.banco.tarjetas.controller;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.service.TarjetaService;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tarjetas")
public class TarjetaController {

    private final TarjetaService service;

    public TarjetaController(TarjetaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Tarjeta> listar(@RequestParam(name = "estado", required = false) EstadoTarjeta estado) {
        return service.listar(Optional.ofNullable(estado));
    }

    @GetMapping("/{id}")
    public Tarjeta obtener(@PathVariable String id) {
        return service.obtener(id);
    }
}

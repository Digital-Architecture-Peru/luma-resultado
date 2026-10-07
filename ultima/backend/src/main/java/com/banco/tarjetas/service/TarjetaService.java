package com.banco.tarjetas.service;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.repository.TarjetaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class TarjetaService {

    private final TarjetaRepository repository;

    public TarjetaService(TarjetaRepository repository) {
        this.repository = repository;
    }

    /** Lista las tarjetas; si se indica estado, filtra por él. */
    public List<Tarjeta> listar(Optional<EstadoTarjeta> estado) {
        return repository.findAll().stream()
                .filter(t -> estado.map(e -> t.estado() == e).orElse(true))
                .toList();
    }

    public Tarjeta obtener(String id) {
        return repository.findById(id).orElseThrow(() -> new TarjetaNoEncontradaException(id));
    }
}

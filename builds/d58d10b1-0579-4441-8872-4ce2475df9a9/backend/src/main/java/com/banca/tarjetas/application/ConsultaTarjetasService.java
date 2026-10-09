package com.banca.tarjetas.application;

import com.banca.tarjetas.domain.Tarjeta;
import com.banca.tarjetas.domain.TarjetaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ConsultaTarjetasService {

    private final TarjetaRepository repositorio;

    public ConsultaTarjetasService(TarjetaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Tarjeta> listar(UUID clienteId) {
        return repositorio.buscarPorCliente(clienteId);
    }

    public Tarjeta detalle(UUID clienteId, UUID tarjetaId) {
        return repositorio.buscarPorIdYCliente(tarjetaId, clienteId)
                .orElseThrow(TarjetaNoEncontradaException::new);
    }
}

package com.banco.tarjetas.service;

import com.banco.tarjetas.atoms.EstadoTarjeta;
import com.banco.tarjetas.atoms.TipoTarjeta;
import com.banco.tarjetas.dto.TarjetaDetalle;
import com.banco.tarjetas.dto.TarjetaResumen;
import com.banco.tarjetas.exception.TarjetaNoEncontradaException;
import com.banco.tarjetas.molecules.TarjetaMapper;
import com.banco.tarjetas.repository.TarjetaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

/** Organism: caso de uso de consulta de tarjetas. */
@Service
public class TarjetaConsultaService {

    private static final String PATRON_ID = "[A-Za-z0-9-]{1,20}";

    private final TarjetaRepository repositorio;
    private final TarjetaMapper mapper;

    public TarjetaConsultaService(TarjetaRepository repositorio, TarjetaMapper mapper) {
        this.repositorio = repositorio;
        this.mapper = mapper;
    }

    /** Lista tarjetas con filtros opcionales (null = sin filtro). */
    public List<TarjetaResumen> listar(String estado, String tipo) {
        EstadoTarjeta estadoFiltro = parsear(estado, EstadoTarjeta.class);
        TipoTarjeta tipoFiltro = parsear(tipo, TipoTarjeta.class);
        return repositorio.listar().stream()
                .filter(t -> estadoFiltro == null || t.estado() == estadoFiltro)
                .filter(t -> tipoFiltro == null || t.tipo() == tipoFiltro)
                .map(mapper::aResumen)
                .toList();
    }

    public TarjetaDetalle obtener(String id) {
        if (id == null || !id.matches(PATRON_ID)) {
            throw new IllegalArgumentException("Identificador de tarjeta inválido");
        }
        return repositorio.buscarPorId(id)
                .map(mapper::aDetalle)
                .orElseThrow(() -> new TarjetaNoEncontradaException(id));
    }

    private <E extends Enum<E>> E parsear(String valor, Class<E> tipo) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return Enum.valueOf(tipo, valor.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Valor de filtro inválido: " + tipo.getSimpleName());
        }
    }
}

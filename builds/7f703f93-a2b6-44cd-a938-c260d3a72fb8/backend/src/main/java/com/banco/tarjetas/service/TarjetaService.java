package com.banco.tarjetas.service;

import com.banco.tarjetas.model.EstadoTarjeta;
import com.banco.tarjetas.model.Tarjeta;
import com.banco.tarjetas.repository.TarjetaRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.regex.Pattern;

@ApplicationScoped
public class TarjetaService {

    private static final Pattern ID_VALIDO = Pattern.compile("^[a-z]{2}-\\d{3}$");

    private final TarjetaRepository repositorio;

    public TarjetaService(TarjetaRepository repositorio) {
        this.repositorio = repositorio;
    }

    /** Lista las tarjetas; si {@code estado} es nulo o vacío no filtra. */
    public List<Tarjeta> listar(String estado) {
        if (estado == null || estado.isBlank()) {
            return repositorio.buscarTodas();
        }
        EstadoTarjeta filtro = EstadoTarjeta.desde(estado);
        return repositorio.buscarTodas().stream().filter(t -> t.estado() == filtro).toList();
    }

    public Tarjeta obtener(String id) {
        if (id == null || !ID_VALIDO.matcher(id).matches()) {
            throw new SolicitudInvalidaException("Identificador de tarjeta no válido.");
        }
        return repositorio.buscarPorId(id).orElseThrow(() -> new TarjetaNoEncontradaException(id));
    }
}

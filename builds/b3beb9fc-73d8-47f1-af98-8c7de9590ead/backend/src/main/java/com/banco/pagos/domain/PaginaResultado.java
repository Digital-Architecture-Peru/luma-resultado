package com.banco.pagos.domain;

import java.util.List;
import java.util.function.Function;

public record PaginaResultado<T>(List<T> contenido, int page, int size, long total) {

    public <R> PaginaResultado<R> map(Function<T, R> transformacion) {
        return new PaginaResultado<>(contenido.stream().map(transformacion).toList(), page, size, total);
    }
}

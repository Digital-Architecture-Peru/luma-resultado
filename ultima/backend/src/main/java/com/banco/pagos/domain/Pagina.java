package com.banco.pagos.domain;

import java.util.List;
import java.util.function.Function;

public record Pagina<T>(List<T> contenido, int page, int size, long totalElementos, int totalPaginas) {

    public static <T> Pagina<T> de(List<T> contenido, int page, int size, long total) {
        int totalPaginas = (int) ((total + size - 1) / size);
        return new Pagina<>(contenido, page, size, total, totalPaginas);
    }

    public <R> Pagina<R> mapear(Function<T, R> funcion) {
        return new Pagina<>(contenido.stream().map(funcion).toList(), page, size, totalElementos, totalPaginas);
    }
}

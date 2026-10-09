package com.banco.pagos.api;

import java.util.List;

public record PaginaDto<T>(List<T> contenido, int page, int size, long total, int totalPaginas) {

    public static <T> PaginaDto<T> de(List<T> contenido, int page, int size, long total) {
        int paginas = (int) ((total + size - 1) / size);
        return new PaginaDto<>(contenido, page, size, total, paginas);
    }
}

package com.banca.internet.cuentas.dto;

import java.util.List;

public record PaginaCuentasDto(
        List<CuentaDto> contenido,
        int pagina,
        int tamanio,
        long totalElementos,
        int totalPaginas) {
}

package com.banca.tarjetas.api;

import java.util.List;

public record PaginaDto<T>(List<T> items, int pagina, int tamano, long total) {
}

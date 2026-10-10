package com.example.cuentas.notificaciones.api.dto;

import com.example.cuentas.notificaciones.domain.Pagina;
import java.util.List;
import java.util.function.Function;

public record PaginaDto<T>(List<T> contenido, int page, int size, long total) {

    public static <S, T> PaginaDto<T> desde(Pagina<S> pagina, Function<S, T> mapeador) {
        return new PaginaDto<>(pagina.contenido().stream().map(mapeador).toList(),
                pagina.page(), pagina.size(), pagina.total());
    }
}

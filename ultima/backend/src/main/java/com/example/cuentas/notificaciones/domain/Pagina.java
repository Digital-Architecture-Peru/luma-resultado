package com.example.cuentas.notificaciones.domain;

import java.util.List;

public record Pagina<T>(List<T> contenido, int page, int size, long total) {
}

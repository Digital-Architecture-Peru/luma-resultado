package com.example.tarjetas.notificaciones.domain;

import java.util.List;

public record Pagina<T>(List<T> items, int page, int size, long total) {
}

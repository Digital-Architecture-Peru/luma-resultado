package com.bank.cards.notifications.domain;

import java.util.List;

/** Página de resultados (paginación por offset). */
public record PageResult<T>(List<T> items, int page, int size, long total) {
}

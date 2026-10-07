package com.banca.internet.tarjetas.molecules;

import java.util.List;

/** Molecule: envoltorio de colección paginada. */
public record PageResponse<T>(List<T> items, int page, int size, long totalItems) {
}

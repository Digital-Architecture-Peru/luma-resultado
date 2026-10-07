package com.banca.tarjetas.model;

import java.util.Locale;
import java.util.Optional;

/** Estado de una tarjeta. */
public enum CardStatus {
    ACTIVE, BLOCKED, EXPIRED;

    public static Optional<CardStatus> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(valueOf(raw.trim().toUpperCase(Locale.ROOT)));
        } catch (IllegalArgumentException e) {
            throw new InvalidQueryException("Estado de tarjeta no válido: " + raw);
        }
    }
}

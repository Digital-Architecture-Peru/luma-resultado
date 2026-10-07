package com.banca.internet.tarjetas.atoms;

import java.util.Optional;

/** Atom: estado de una tarjeta. */
public enum CardStatus {
    ACTIVE, BLOCKED, EXPIRED, CANCELLED;

    public static Optional<CardStatus> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(valueOf(raw.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Estado de tarjeta no válido: " + raw);
        }
    }
}

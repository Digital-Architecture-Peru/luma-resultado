package com.banco.notifications.domain;

import java.util.UUID;

/** Tarjeta del cliente. Solo se conservan los últimos 4 dígitos del PAN. */
public record Card(UUID id, String brand, String alias, String panLast4) {
}

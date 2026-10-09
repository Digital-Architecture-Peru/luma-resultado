package com.bank.cards.notifications.domain;

/** Preferencia del cliente: si desea recibir avisos de un tipo para una tarjeta. */
public record Preference(NotificationType type, boolean enabled) {
}

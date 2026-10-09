package com.bank.cards.notifications.domain;

/** Tipos de aviso que el cliente puede recibir sobre una tarjeta. */
public enum NotificationType {
    PURCHASE,
    PAYMENT_DUE,
    CARD_BLOCKED,
    LIMIT_REACHED
}

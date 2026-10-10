package com.example.banca.notification.domain;

/** IN_APP es la bandeja real; EMAIL y SMS solo se simulan (sin integración definida). */
public enum Channel {
    IN_APP,
    EMAIL,
    SMS
}

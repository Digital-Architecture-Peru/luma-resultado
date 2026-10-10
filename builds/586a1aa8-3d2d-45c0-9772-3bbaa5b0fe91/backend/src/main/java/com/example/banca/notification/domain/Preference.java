package com.example.banca.notification.domain;

public record Preference(EventType eventType, Channel channel, boolean enabled) {
}

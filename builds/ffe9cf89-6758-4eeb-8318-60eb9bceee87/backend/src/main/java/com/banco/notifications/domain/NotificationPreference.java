package com.banco.notifications.domain;

public record NotificationPreference(NotificationType type, Channel channel, boolean enabled) {
}

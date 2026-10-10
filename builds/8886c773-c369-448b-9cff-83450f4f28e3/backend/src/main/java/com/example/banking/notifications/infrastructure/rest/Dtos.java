package com.example.banking.notifications.infrastructure.rest;

import com.example.banking.notifications.domain.Channel;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationType;
import com.example.banking.notifications.domain.Preference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** DTOs del contrato /api/v1, separados de las entidades de dominio. */
public final class Dtos {

    private Dtos() {
    }

    public record NotificationResponse(UUID id, String accountId, String type, String title,
                                       String message, String status, Instant createdAt, Instant readAt) {
        public static NotificationResponse from(Notification n) {
            return new NotificationResponse(n.id(), n.accountId(), n.type().name(), n.title(),
                    n.message(), n.status().name(), n.createdAt(), n.readAt());
        }
    }

    public record PreferenceDto(@NotNull NotificationType type, @NotNull Channel channel, boolean enabled,
                                @DecimalMin("0.00") BigDecimal thresholdAmount) {
        public static PreferenceDto from(Preference p) {
            return new PreferenceDto(p.type(), p.channel(), p.enabled(), p.thresholdAmount());
        }

        public Preference toDomain(String accountId) {
            return new Preference(accountId, type, channel, enabled, thresholdAmount);
        }
    }

    public record PreferencesRequest(@NotNull @Valid List<PreferenceDto> preferences) {
    }

    public record Problem(String type, String title, int status, String detail) {
    }
}

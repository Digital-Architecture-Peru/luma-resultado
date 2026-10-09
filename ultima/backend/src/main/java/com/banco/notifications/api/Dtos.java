package com.banco.notifications.api;

import com.banco.notifications.domain.Card;
import com.banco.notifications.domain.Channel;
import com.banco.notifications.domain.Notification;
import com.banco.notifications.domain.NotificationPreference;
import com.banco.notifications.domain.NotificationStatus;
import com.banco.notifications.domain.NotificationType;
import com.banco.notifications.domain.PagedResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class Dtos {

    private Dtos() {
    }

    public record CardResponse(UUID id, String brand, String alias, String panLast4) {
        static CardResponse from(Card c) {
            return new CardResponse(c.id(), c.brand(), c.alias(), c.panLast4());
        }
    }

    public record NotificationResponse(UUID id, UUID cardId, NotificationType type, String title,
                                       String message, BigDecimal amount, String currency,
                                       NotificationStatus status, Instant createdAt, Instant readAt) {
        static NotificationResponse from(Notification n) {
            return new NotificationResponse(n.id(), n.cardId(), n.type(), n.title(), n.message(),
                    n.amount(), n.currency(), n.status(), n.createdAt(), n.readAt());
        }
    }

    public record PageResponse<T>(List<T> items, int page, int size, long total) {
        static PageResponse<NotificationResponse> from(PagedResult<Notification> p) {
            return new PageResponse<>(p.items().stream().map(NotificationResponse::from).toList(),
                    p.page(), p.size(), p.total());
        }
    }

    public record PreferenceDto(@NotNull NotificationType type, @NotNull Channel channel, boolean enabled) {
        static PreferenceDto from(NotificationPreference p) {
            return new PreferenceDto(p.type(), p.channel(), p.enabled());
        }

        NotificationPreference toDomain() {
            return new NotificationPreference(type, channel, enabled);
        }
    }

    public record UpdatePreferencesRequest(@NotNull @Size(max = 50) List<@Valid @NotNull PreferenceDto> preferences) {
    }

    public record PreferencesResponse(List<PreferenceDto> preferences) {
        static PreferencesResponse from(List<NotificationPreference> list) {
            return new PreferencesResponse(list.stream().map(PreferenceDto::from).toList());
        }
    }
}

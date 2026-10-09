package com.bank.cards.notifications.api;

import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.NotificationType;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** DTOs del contrato REST, separados del dominio. Solo exponen los últimos 4 dígitos de la tarjeta. */
public final class ApiDtos {

    /** Moneda única del alcance actual (hipótesis H5). */
    public static final String CURRENCY = "PEN";

    private ApiDtos() {
    }

    public record NotificationDto(
            UUID id,
            UUID cardId,
            String cardLast4,
            NotificationType type,
            String title,
            String message,
            BigDecimal amount,
            String currency,
            boolean read,
            Instant readAt,
            Instant createdAt) {

        public static NotificationDto from(CardNotification n) {
            return new NotificationDto(n.id(), n.cardId(), n.cardLast4(), n.type(), n.title(), n.message(),
                    n.amount(), CURRENCY, n.isRead(), n.readAt(), n.createdAt());
        }
    }

    public record PageDto<T>(List<T> items, int page, int size, long total) {

        public static PageDto<NotificationDto> from(PageResult<CardNotification> result) {
            return new PageDto<>(result.items().stream().map(NotificationDto::from).toList(),
                    result.page(), result.size(), result.total());
        }
    }

    public record PreferenceDto(NotificationType type, boolean enabled) {

        public static PreferenceDto from(Preference preference) {
            return new PreferenceDto(preference.type(), preference.enabled());
        }

        public Preference toDomain() {
            return new Preference(type, enabled);
        }
    }

    /** Cuerpo de error con los campos de RFC 7807. */
    public record ProblemDto(String type, String title, int status, String detail) {
    }
}

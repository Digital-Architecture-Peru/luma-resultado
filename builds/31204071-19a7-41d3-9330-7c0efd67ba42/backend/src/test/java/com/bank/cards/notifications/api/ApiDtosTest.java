package com.bank.cards.notifications.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bank.cards.notifications.api.ApiDtos.NotificationDto;
import com.bank.cards.notifications.api.ApiDtos.PageDto;
import com.bank.cards.notifications.api.ApiDtos.PreferenceDto;
import com.bank.cards.notifications.domain.CardNotification;
import com.bank.cards.notifications.domain.NotificationType;
import com.bank.cards.notifications.domain.PageResult;
import com.bank.cards.notifications.domain.Preference;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ApiDtosTest {

    private static final Instant CREATED = Instant.parse("2026-10-09T10:00:00Z");

    private static CardNotification sample(Instant readAt) {
        return new CardNotification(UUID.randomUUID(), UUID.randomUUID(), "4242", NotificationType.PURCHASE,
                "Compra aprobada", "Compra de prueba", new BigDecimal("150.00"), readAt, CREATED);
    }

    @Test
    void givenUnreadNotification_whenMapped_thenReadFlagIsFalseAndCurrencyIsPen() {
        NotificationDto dto = NotificationDto.from(sample(null));

        assertFalse(dto.read());
        assertNull(dto.readAt());
        assertEquals("PEN", dto.currency());
        assertEquals("4242", dto.cardLast4());
    }

    @Test
    void givenReadNotification_whenMapped_thenReadFlagIsTrue() {
        assertTrue(NotificationDto.from(sample(CREATED.plusSeconds(5))).read());
    }

    @Test
    void givenPageResult_whenMapped_thenKeepsPagingMetadata() {
        PageDto<NotificationDto> dto = PageDto.from(new PageResult<>(List.of(sample(null)), 2, 10, 21));

        assertEquals(1, dto.items().size());
        assertEquals(2, dto.page());
        assertEquals(10, dto.size());
        assertEquals(21, dto.total());
    }

    @Test
    void givenPreference_whenRoundTrip_thenKeepsValues() {
        Preference original = new Preference(NotificationType.CARD_BLOCKED, false);

        assertEquals(original, PreferenceDto.from(original).toDomain());
    }
}

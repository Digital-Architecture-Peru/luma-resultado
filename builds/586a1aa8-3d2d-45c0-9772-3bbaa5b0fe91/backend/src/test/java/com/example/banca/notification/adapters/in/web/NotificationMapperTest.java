package com.example.banca.notification.adapters.in.web;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.banca.notification.adapters.in.web.Dtos.NotificationDto;
import com.example.banca.notification.domain.AccountMask;
import com.example.banca.notification.domain.EventType;
import com.example.banca.notification.domain.NotificationStatus;
import com.example.banca.notification.domain.PaymentNotification;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class NotificationMapperTest {

    private PaymentNotification withAccount(String account) {
        return new PaymentNotification(UUID.randomUUID(), "CUST-0001", "PAY-1", EventType.PAGO_EXITOSO,
                new BigDecimal("5.00"), "USD", account, NotificationStatus.UNREAD, Instant.EPOCH, null);
    }

    @Test
    void givenFullAccountNumber_whenMapped_thenOnlyLastFourDigitsAreExposed() {
        NotificationDto dto = NotificationMapper.toDto(withAccount("00112233449876"));

        assertEquals("****9876", dto.maskedAccount());
    }

    @Test
    void givenAlreadyMaskedAccount_whenMapped_thenMaskIsStable() {
        assertEquals("****1234", NotificationMapper.toDto(withAccount("****1234")).maskedAccount());
    }

    @Test
    void givenShortOrNullAccount_whenMasked_thenNothingIsRevealed() {
        assertEquals("****", AccountMask.mask("12"));
        assertEquals("****", AccountMask.mask(null));
    }
}

package com.example.banca.notification.adapters.in.web;

import com.example.banca.notification.adapters.in.web.Dtos.NotificationDto;
import com.example.banca.notification.adapters.in.web.Dtos.PageDto;
import com.example.banca.notification.adapters.in.web.Dtos.PreferenceDto;
import com.example.banca.notification.domain.AccountMask;
import com.example.banca.notification.domain.PageResult;
import com.example.banca.notification.domain.PaymentNotification;
import com.example.banca.notification.domain.Preference;

public final class NotificationMapper {

    private NotificationMapper() {
    }

    /** Siempre enmascara la cuenta, aunque el dato ya venga enmascarado. */
    public static NotificationDto toDto(PaymentNotification n) {
        return new NotificationDto(n.id(), n.paymentId(), n.eventType(), n.amount(), n.currency(),
                AccountMask.mask(n.maskedAccount()), n.status(), n.createdAt(), n.readAt());
    }

    public static PageDto<NotificationDto> toPageDto(PageResult<PaymentNotification> page) {
        return new PageDto<>(page.items().stream().map(NotificationMapper::toDto).toList(),
                page.page(), page.size(), page.totalElements());
    }

    public static PreferenceDto toDto(Preference p) {
        return new PreferenceDto(p.eventType(), p.channel(), p.enabled());
    }

    public static Preference toDomain(PreferenceDto dto) {
        return new Preference(dto.eventType(), dto.channel(), dto.enabled());
    }
}

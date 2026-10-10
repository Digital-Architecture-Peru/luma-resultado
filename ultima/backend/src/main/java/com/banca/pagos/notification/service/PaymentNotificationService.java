package com.banca.pagos.notification.service;

import com.banca.pagos.notification.domain.NotificationStatus;
import com.banca.pagos.notification.domain.NotificationType;
import com.banca.pagos.notification.domain.PaymentNotification;
import com.banca.pagos.notification.port.NotificationChannel;
import com.banca.pagos.notification.port.NotificationRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class PaymentNotificationService {

    static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository repository;
    private final NotificationChannel channel;
    private final Clock clock;

    @Inject
    public PaymentNotificationService(NotificationRepository repository, NotificationChannel channel, Clock clock) {
        this.repository = repository;
        this.channel = channel;
        this.clock = clock;
    }

    public PaymentNotification register(PaymentEvent event) {
        validate(event);
        if (repository.existsByReferenceAndType(event.paymentReference(), event.type())) {
            throw NotificationException.duplicate(event.paymentReference(), event.type());
        }
        PaymentNotification saved = repository.save(build(event));
        channel.send(saved);
        return saved;
    }

    public PageResult<PaymentNotification> list(String customerId, NotificationStatus status, int page, int size) {
        requireCustomer(customerId);
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw NotificationException.invalid("page debe ser >= 0 y size entre 1 y " + MAX_PAGE_SIZE);
        }
        List<PaymentNotification> items = repository.findByCustomer(customerId, status, page, size);
        return new PageResult<>(items, repository.countByCustomer(customerId, status));
    }

    public void markAsRead(String customerId, UUID id) {
        requireCustomer(customerId);
        PaymentNotification current = repository.findByIdAndCustomer(id, customerId)
                .orElseThrow(() -> NotificationException.notFound(id));
        PaymentNotification updated = current.markRead(Instant.now(clock));
        if (updated != current) {
            repository.save(updated);
        }
    }

    private PaymentNotification build(PaymentEvent event) {
        String account = AccountMasker.mask(event.accountNumber());
        String amount = event.currency() + " " + event.amount().setScale(2, RoundingMode.HALF_UP).toPlainString();
        String ref = event.paymentReference();
        String title;
        String message;
        switch (event.type()) {
            case PAGO_EXITOSO -> {
                title = "Pago exitoso";
                message = "Tu pago " + ref + " por " + amount + " desde la cuenta " + account + " fue procesado.";
            }
            case PAGO_RECHAZADO -> {
                title = "Pago rechazado";
                message = "Tu pago " + ref + " por " + amount + " desde la cuenta " + account + " fue rechazado.";
            }
            case PAGO_PROGRAMADO_PROXIMO -> {
                title = "Pago programado próximo";
                message = "Tu pago " + ref + " por " + amount + " desde la cuenta " + account
                        + " se ejecutará pronto.";
            }
            default -> throw NotificationException.invalid("Tipo no soportado: " + event.type());
        }
        return new PaymentNotification(UUID.randomUUID(), event.customerId(), ref, event.type(),
                NotificationStatus.UNREAD, title, message,
                event.amount().setScale(2, RoundingMode.HALF_UP), event.currency(), Instant.now(clock), null);
    }

    private static void validate(PaymentEvent event) {
        requireCustomer(event.customerId());
        if (isBlank(event.paymentReference()) || event.paymentReference().length() > 40) {
            throw NotificationException.invalid("paymentReference es obligatorio (máx. 40 caracteres)");
        }
        NotificationType type = event.type();
        if (type == null) {
            throw NotificationException.invalid("type es obligatorio");
        }
        if (event.amount() == null || event.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw NotificationException.invalid("amount debe ser mayor que cero");
        }
        if (event.currency() == null || !event.currency().matches("[A-Z]{3}")) {
            throw NotificationException.invalid("currency debe ser un código ISO-4217 de 3 letras");
        }
    }

    private static void requireCustomer(String customerId) {
        if (isBlank(customerId) || customerId.length() > 36) {
            throw NotificationException.invalid("Cabecera X-Customer-Id obligatoria (máx. 36 caracteres)");
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

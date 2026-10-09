package com.banco.payments.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.payments.domain.DuplicateIdempotencyKeyException;
import com.banco.payments.domain.InvalidPaymentException;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentNotFoundException;
import com.banco.payments.domain.PaymentRepository;
import com.banco.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentServiceTest {

    private PaymentRepository repository;
    private PaymentGateway gateway;
    private PaymentService service;

    @BeforeEach
    void setUp() {
        repository = mock(PaymentRepository.class);
        gateway = mock(PaymentGateway.class);
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
        service = new PaymentService(repository, gateway, clock, new BigDecimal("50000"));
    }

    private static CreatePaymentCommand command(String key) {
        return new CreatePaymentCommand("00012345678901", "Empresa Demo", new BigDecimal("100.00"),
                "PEN", "Recibo", key);
    }

    @Test
    void givenAuthorizedPayment_whenCreate_thenConfirmedAndSaved() {
        when(gateway.authorize(any())).thenReturn(true);
        Payment result = service.create(command("k1"));
        assertEquals(PaymentStatus.CONFIRMADO, result.status());
        verify(repository).save(result);
    }

    @Test
    void givenDeclinedPayment_whenCreate_thenRejectedAndSaved() {
        when(gateway.authorize(any())).thenReturn(false);
        Payment result = service.create(command(null));
        assertEquals(PaymentStatus.RECHAZADO, result.status());
        verify(repository).save(result);
    }

    @Test
    void givenUsedIdempotencyKey_whenCreate_thenConflictWithoutSaving() {
        Payment existing = Payment.create("00012345678901", "X", BigDecimal.ONE, "PEN", "c", "k1",
                new BigDecimal("50000"), Instant.now());
        when(repository.findByIdempotencyKey("k1")).thenReturn(Optional.of(existing));
        assertThrows(DuplicateIdempotencyKeyException.class, () -> service.create(command("k1")));
        verify(repository, never()).save(any());
    }

    @Test
    void givenInvalidAmount_whenCreate_thenInvalidAndGatewayNotCalled() {
        CreatePaymentCommand bad = new CreatePaymentCommand("00012345678901", "Empresa", BigDecimal.ZERO,
                "PEN", "Recibo", null);
        assertThrows(InvalidPaymentException.class, () -> service.create(bad));
        verify(gateway, never()).authorize(any());
    }

    @Test
    void givenUnknownId_whenGet_thenNotFound() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());
        assertThrows(PaymentNotFoundException.class, () -> service.get(id));
    }
}

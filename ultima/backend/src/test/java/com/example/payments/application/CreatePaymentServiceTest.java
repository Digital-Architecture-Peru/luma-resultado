package com.example.payments.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.payments.application.CreatePaymentService.Command;
import com.example.payments.domain.DuplicateIdempotencyKeyException;
import com.example.payments.domain.Money;
import com.example.payments.domain.Payment;
import com.example.payments.domain.PaymentGateway;
import com.example.payments.domain.PaymentGateway.GatewayDecision;
import com.example.payments.domain.PaymentRepository;
import com.example.payments.domain.PaymentStatus;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class CreatePaymentServiceTest {

    private PaymentRepository repository;
    private PaymentGateway gateway;
    private CreatePaymentService service;

    @BeforeEach
    void setUp() {
        repository = mock(PaymentRepository.class);
        gateway = mock(PaymentGateway.class);
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
        service = new CreatePaymentService(repository, gateway, clock);
        when(repository.findByIdempotencyKey(any())).thenReturn(Optional.empty());
    }

    private static Command command(String key, String amount) {
        return new Command(key, "ES00-FAKE-0001", "ES00-FAKE-9001", amount, "EUR", "ref");
    }

    @Test
    void givenApprovedByGateway_whenCreate_thenCompletedAndSaved() {
        when(gateway.authorize(any())).thenReturn(GatewayDecision.approve());

        Payment result = service.create(command("k1", "50.00"));

        assertEquals(PaymentStatus.COMPLETED, result.status());
        verify(repository).save(result);
    }

    @Test
    void givenRejectedByGateway_whenCreate_thenRejectedAndSaved() {
        when(gateway.authorize(any())).thenReturn(GatewayDecision.reject("limite"));

        Payment result = service.create(command("k1", "50000.00"));

        assertEquals(PaymentStatus.REJECTED, result.status());
        verify(repository).save(result);
    }

    @Test
    void givenSameKeyAndSameRequest_whenCreate_thenReturnsExistingWithoutSaving() {
        Payment existing = Payment.restore(java.util.UUID.randomUUID(), "k1", "ES00-FAKE-0001",
                "ES00-FAKE-9001", Money.of("50.00", "EUR"), "ref", PaymentStatus.COMPLETED, Instant.now());
        when(repository.findByIdempotencyKey("k1")).thenReturn(Optional.of(existing));

        Payment result = service.create(command("k1", "50"));

        assertSame(existing, result);
        verify(repository, never()).save(any());
        Mockito.verifyNoInteractions(gateway);
    }

    @Test
    void givenSameKeyAndDifferentAmount_whenCreate_thenConflict() {
        Payment existing = Payment.restore(java.util.UUID.randomUUID(), "k1", "ES00-FAKE-0001",
                "ES00-FAKE-9001", Money.of("50.00", "EUR"), "ref", PaymentStatus.COMPLETED, Instant.now());
        when(repository.findByIdempotencyKey("k1")).thenReturn(Optional.of(existing));

        assertThrows(IdempotencyConflictException.class, () -> service.create(command("k1", "51.00")));
    }

    @Test
    void givenRaceOnSave_whenCreate_thenReturnsWinner() {
        when(gateway.authorize(any())).thenReturn(GatewayDecision.approve());
        Payment winner = Payment.restore(java.util.UUID.randomUUID(), "k1", "ES00-FAKE-0001",
                "ES00-FAKE-9001", Money.of("50.00", "EUR"), "ref", PaymentStatus.COMPLETED, Instant.now());
        when(repository.findByIdempotencyKey("k1")).thenReturn(Optional.empty(), Optional.of(winner));
        Mockito.doThrow(new DuplicateIdempotencyKeyException("k1")).when(repository).save(any());

        assertSame(winner, service.create(command("k1", "50.00")));
    }

    @Test
    void givenBlankKey_whenCreate_thenIllegalArgument() {
        assertThrows(IllegalArgumentException.class, () -> service.create(command(" ", "50.00")));
    }

    @Test
    void givenInvalidAmount_whenCreate_thenIllegalArgumentAndNoGatewayCall() {
        assertThrows(IllegalArgumentException.class, () -> service.create(command("k1", "0.00")));
        Mockito.verifyNoInteractions(gateway);
    }
}

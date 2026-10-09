package com.banco.payments.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.payments.application.ports.AccountRepository;
import com.banco.payments.application.ports.PaymentGateway;
import com.banco.payments.application.ports.PaymentRepository;
import com.banco.payments.domain.Account;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    private static final UUID SOURCE_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final String CUSTOMER = "CUST-001";

    @Mock PaymentRepository payments;
    @Mock AccountRepository accounts;
    @Mock PaymentGateway gateway;

    private PaymentService service;
    private Account source;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
        service = new PaymentService(payments, accounts, gateway, clock);
        source = new Account(SOURCE_ID, CUSTOMER, "EC00-1000-0001", "USD", new BigDecimal("500.00"), 3);
    }

    private PaymentCommand command(String amount, String currency, String target) {
        return new PaymentCommand(CUSTOMER, "key-1", SOURCE_ID, target, new BigDecimal(amount), currency, "Renta");
    }

    @Test
    void givenFundsAndApproval_whenCreate_thenCompletesAndDebits() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));
        when(gateway.authorize(any())).thenReturn(true);
        when(accounts.updateBalance(any(), anyLong())).thenReturn(true);
        when(payments.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = service.create(command("120.50", "USD", "EC00-9999-0001"));

        assertEquals(PaymentStatus.COMPLETED, result.status());
        ArgumentCaptor<Account> debited = ArgumentCaptor.forClass(Account.class);
        verify(accounts).updateBalance(debited.capture(), org.mockito.ArgumentMatchers.eq(3L));
        assertEquals(new BigDecimal("379.50"), debited.getValue().balance());
        assertEquals(4L, debited.getValue().version());
    }

    @Test
    void givenGatewayRejects_whenCreate_thenRejectedWithoutDebit() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));
        when(gateway.authorize(any())).thenReturn(false);
        when(payments.save(any())).thenAnswer(i -> i.getArgument(0));

        Payment result = service.create(command("10.00", "USD", "EC00-9999-0000"));

        assertEquals(PaymentStatus.REJECTED, result.status());
        verify(accounts, never()).updateBalance(any(), anyLong());
    }

    @Test
    void givenAmountAboveBalance_whenCreate_thenInsufficientFunds() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));

        assertThrows(PaymentErrors.InsufficientFunds.class,
                () -> service.create(command("500.01", "USD", "EC00-9999-0001")));
        verify(gateway, never()).authorize(any());
    }

    @Test
    void givenCurrencyMismatch_whenCreate_thenInvalidPayment() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));

        assertThrows(PaymentErrors.InvalidPayment.class,
                () -> service.create(command("10.00", "EUR", "EC00-9999-0001")));
    }

    @Test
    void givenSameSourceAndTarget_whenCreate_thenInvalidPayment() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));

        assertThrows(PaymentErrors.InvalidPayment.class,
                () -> service.create(command("10.00", "USD", "EC00-1000-0001")));
    }

    @Test
    void givenAccountOfAnotherCustomer_whenCreate_thenNotFound() {
        Account foreign = new Account(SOURCE_ID, "CUST-999", "EC00-1000-0001", "USD", new BigDecimal("500.00"), 0);
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(foreign));

        assertThrows(PaymentErrors.NotFound.class,
                () -> service.create(command("10.00", "USD", "EC00-9999-0001")));
    }

    @Test
    void givenConcurrentModification_whenCreate_thenConcurrentUpdate() {
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.empty());
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));
        when(gateway.authorize(any())).thenReturn(true);
        when(accounts.updateBalance(any(), anyLong())).thenReturn(false);

        assertThrows(PaymentErrors.ConcurrentUpdate.class,
                () -> service.create(command("10.00", "USD", "EC00-9999-0001")));
        verify(payments, never()).save(any());
    }

    @Test
    void givenRepeatedKeyWithSameBody_whenCreate_thenReturnsExistingWithoutNewCharge() {
        Payment existing = new Payment(UUID.randomUUID(), "key-1", SOURCE_ID, "EC00-9999-0001",
                new BigDecimal("10.00"), "USD", PaymentStatus.COMPLETED, "Renta", Instant.EPOCH);
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.of(existing));

        Payment result = service.create(command("10", "USD", "EC00-9999-0001"));

        assertSame(existing, result);
        verify(accounts, never()).updateBalance(any(), anyLong());
        verify(payments, never()).save(any());
    }

    @Test
    void givenRepeatedKeyWithDifferentBody_whenCreate_thenIdempotencyConflict() {
        Payment existing = new Payment(UUID.randomUUID(), "key-1", SOURCE_ID, "EC00-9999-0001",
                new BigDecimal("10.00"), "USD", PaymentStatus.COMPLETED, "Renta", Instant.EPOCH);
        when(payments.findByIdempotencyKey("key-1")).thenReturn(Optional.of(existing));

        assertThrows(PaymentErrors.IdempotencyConflict.class,
                () -> service.create(command("11.00", "USD", "EC00-9999-0001")));
    }

    @Test
    void givenPaymentOfAnotherCustomer_whenGet_thenNotFound() {
        UUID id = UUID.randomUUID();
        Payment payment = new Payment(id, "key-1", SOURCE_ID, "EC00-9999-0001",
                new BigDecimal("10.00"), "USD", PaymentStatus.COMPLETED, null, Instant.EPOCH);
        when(payments.findById(id)).thenReturn(Optional.of(payment));
        when(accounts.findById(SOURCE_ID)).thenReturn(Optional.of(source));

        assertThrows(PaymentErrors.NotFound.class, () -> service.get(id, "CUST-999"));
    }
}

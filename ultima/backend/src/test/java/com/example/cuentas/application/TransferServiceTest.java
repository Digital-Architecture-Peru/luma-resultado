package com.example.cuentas.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.example.cuentas.domain.Account;
import com.example.cuentas.domain.AccountRepository;
import com.example.cuentas.domain.DomainException;
import com.example.cuentas.domain.Movement;
import com.example.cuentas.domain.MovementRepository;
import com.example.cuentas.domain.Transfer;
import com.example.cuentas.domain.TransferRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-01T10:00:00Z");

    @Mock AccountRepository accounts;
    @Mock TransferRepository transfers;
    @Mock MovementRepository movements;

    private TransferService service;
    private Account source;
    private Account target;

    @BeforeEach
    void setUp() {
        service = new TransferService(accounts, transfers, movements, Clock.fixed(NOW, ZoneOffset.UTC));
        source = new Account(1L, "0001", "Demo", "CLI-001", "USD", new BigDecimal("100.00"));
        target = new Account(2L, "0002", "Demo", "CLI-001", "USD", new BigDecimal("10.00"));
        lenient().when(transfers.add(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    private TransferService.Command command(String key, long from, long to, String amount) {
        return new TransferService.Command("CLI-001", key, from, to, new BigDecimal(amount), "USD", "Prueba");
    }

    private void stubLock() {
        when(accounts.lockByIds(any())).thenReturn(List.of(source, target));
    }

    @Test
    void givenFunds_whenTransfer_thenBalancesMoveAndLedgerHasTwoEntries() {
        stubLock();

        TransferService.Result result = service.execute(command("k1", 1, 2, "30.00"));

        assertFalse(result.replayed());
        assertEquals("COMPLETED", result.transfer().getStatus());
        assertEquals(new BigDecimal("70.00"), source.getBalance());
        assertEquals(new BigDecimal("40.00"), target.getBalance());
        verify(movements, times(2)).add(any(Movement.class));
    }

    @Test
    void givenInsufficientFunds_whenTransfer_thenRejectedWithoutPersisting() {
        stubLock();

        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k2", 1, 2, "500.00")));

        assertEquals("INSUFFICIENT_FUNDS", ex.getCode());
        verify(transfers, never()).add(any());
        verify(movements, never()).add(any());
    }

    @Test
    void givenSameAccount_whenTransfer_thenRejected() {
        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k3", 1, 1, "5.00")));

        assertEquals("SAME_ACCOUNT", ex.getCode());
    }

    @Test
    void givenDifferentCurrencies_whenTransfer_thenRejected() {
        Account eur = new Account(2L, "0002", "Demo", "CLI-001", "EUR", new BigDecimal("10.00"));
        when(accounts.lockByIds(any())).thenReturn(List.of(source, eur));

        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k4", 1, 2, "5.00")));

        assertEquals("CURRENCY_MISMATCH", ex.getCode());
    }

    @Test
    void givenAccountOfAnotherCustomer_whenTransfer_thenRejected() {
        Account foreign = new Account(2L, "0002", "Otro", "CLI-002", "USD", new BigDecimal("10.00"));
        when(accounts.lockByIds(any())).thenReturn(List.of(source, foreign));

        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k5", 1, 2, "5.00")));

        assertEquals("ACCOUNT_NOT_OWNED", ex.getCode());
    }

    @Test
    void givenMissingAccount_whenTransfer_thenNotFound() {
        when(accounts.lockByIds(any())).thenReturn(List.of(source));

        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k6", 1, 2, "5.00")));

        assertEquals(DomainException.Kind.NOT_FOUND, ex.getKind());
    }

    @Test
    void givenRepeatedKeyWithSameBody_whenTransfer_thenReplayWithoutNewCharge() {
        Transfer previous = Transfer.completed("k7", 1L, 2L, new BigDecimal("30.00"), "USD", "Prueba", NOW);
        when(transfers.findByIdempotencyKey("k7")).thenReturn(Optional.of(previous));

        TransferService.Result result = service.execute(command("k7", 1, 2, "30.00"));

        assertTrue(result.replayed());
        verifyNoInteractions(accounts, movements);
    }

    @Test
    void givenRepeatedKeyWithDifferentBody_whenTransfer_thenIdempotencyConflict() {
        Transfer previous = Transfer.completed("k8", 1L, 2L, new BigDecimal("30.00"), "USD", "Prueba", NOW);
        when(transfers.findByIdempotencyKey("k8")).thenReturn(Optional.of(previous));

        DomainException ex = assertThrows(DomainException.class,
                () -> service.execute(command("k8", 1, 2, "31.00")));

        assertEquals(DomainException.Kind.IDEMPOTENCY_CONFLICT, ex.getKind());
    }
}

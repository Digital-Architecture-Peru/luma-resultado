package com.banco.cuentas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banco.cuentas.domain.AccountNotFoundException;
import com.banco.cuentas.domain.IdempotencyConflictException;
import com.banco.cuentas.domain.InsufficientFundsException;
import com.banco.cuentas.domain.MovementType;
import com.banco.cuentas.domain.TransferCommand;
import com.banco.cuentas.domain.TransferReceipt;
import com.banco.cuentas.domain.ValidationException;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TransferServiceTest {

    private static final Instant NOW = Instant.parse("2026-01-15T10:00:00Z");

    private InMemoryAccountRepository repository;
    private final List<TransferReceipt> notified = new ArrayList<>();
    private TransferService service;

    @BeforeEach
    void setUp() {
        repository = new InMemoryAccountRepository()
                .add(1, "USD", "100.00")
                .add(2, "USD", "50.00")
                .add(3, "EUR", "10.00");
        notified.clear();
        service = new TransferService(repository, notified::add, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private static TransferCommand cmd(String key, Long source, Long target, String amount, String currency) {
        return new TransferCommand(key, source, target, amount == null ? null : new BigDecimal(amount),
                currency, "Pago interno");
    }

    @Test
    void givenEnoughBalance_whenTransfer_thenDebitsCreditsAndRecordsBothMovements() {
        TransferReceipt receipt = service.transfer(cmd("k1", 1L, 2L, "30.25", "USD"));

        assertEquals(new BigDecimal("69.75"), repository.balanceOf(1));
        assertEquals(new BigDecimal("80.25"), repository.balanceOf(2));
        assertEquals(NOW, receipt.createdAt());
        assertEquals(2, repository.movements.size());
        assertEquals(MovementType.DEBIT, repository.findMovements(1).get(0).type());
        assertEquals(MovementType.CREDIT, repository.findMovements(2).get(0).type());
        assertEquals(List.of(receipt), notified);
    }

    @Test
    void givenCrossedAccounts_whenTransfer_thenLocksInAscendingIdOrder() {
        service.transfer(cmd("k1", 2L, 1L, "10.00", "USD"));

        assertEquals(List.of(1L, 2L), repository.lastLockOrder);
    }

    @Test
    void givenInsufficientBalance_whenTransfer_thenFailsWithoutChanges() {
        assertThrows(InsufficientFundsException.class,
                () -> service.transfer(cmd("k1", 1L, 2L, "100.01", "USD")));

        assertEquals(new BigDecimal("100.00"), repository.balanceOf(1));
        assertTrue(repository.transfers.isEmpty());
        assertTrue(notified.isEmpty());
    }

    @Test
    void givenExactBalance_whenTransfer_thenLeavesSourceInZero() {
        service.transfer(cmd("k1", 1L, 2L, "100.00", "USD"));

        assertEquals(0, repository.balanceOf(1).signum());
    }

    @Test
    void givenSameAccount_whenTransfer_thenValidationError() {
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", 1L, 1L, "5.00", "USD")));
    }

    @Test
    void givenNonPositiveOrNullAmount_whenTransfer_thenValidationError() {
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", 1L, 2L, "0", "USD")));
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k2", 1L, 2L, "-1.00", "USD")));
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k3", 1L, 2L, null, "USD")));
    }

    @Test
    void givenMoreThanTwoDecimals_whenTransfer_thenValidationError() {
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", 1L, 2L, "1.005", "USD")));
    }

    @Test
    void givenMissingKeyOrAccounts_whenTransfer_thenValidationError() {
        assertThrows(ValidationException.class, () -> service.transfer(cmd(" ", 1L, 2L, "5.00", "USD")));
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", null, 2L, "5.00", "USD")));
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", 1L, 2L, "5.00", "usd")));
    }

    @Test
    void givenUnknownAccount_whenTransfer_thenNotFound() {
        assertThrows(AccountNotFoundException.class, () -> service.transfer(cmd("k1", 1L, 99L, "5.00", "USD")));
    }

    @Test
    void givenCurrencyMismatch_whenTransfer_thenValidationError() {
        assertThrows(ValidationException.class, () -> service.transfer(cmd("k1", 1L, 3L, "5.00", "USD")));
        assertEquals(new BigDecimal("100.00"), repository.balanceOf(1));
    }

    @Test
    void givenSameKeyAndSameRequest_whenRetried_thenReturnsSameReceiptWithoutDoubleCharge() {
        TransferReceipt first = service.transfer(cmd("k1", 1L, 2L, "20.00", "USD"));
        TransferReceipt second = service.transfer(cmd("k1", 1L, 2L, "20.00", "USD"));

        assertSame(first, second);
        assertEquals(new BigDecimal("80.00"), repository.balanceOf(1));
        assertEquals(1, notified.size());
    }

    @Test
    void givenSameKeyAndDifferentRequest_whenRetried_thenConflict() {
        service.transfer(cmd("k1", 1L, 2L, "20.00", "USD"));

        assertThrows(IdempotencyConflictException.class,
                () -> service.transfer(cmd("k1", 1L, 2L, "21.00", "USD")));
    }

    @Test
    void givenUnknownAccount_whenListMovements_thenNotFound() {
        assertThrows(AccountNotFoundException.class, () -> service.listMovements(99L));
    }
}

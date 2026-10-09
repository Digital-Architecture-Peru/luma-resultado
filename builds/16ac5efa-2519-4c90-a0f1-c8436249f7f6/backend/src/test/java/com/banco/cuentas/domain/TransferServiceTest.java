package com.banco.cuentas.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banco.cuentas.fakes.InMemoryAccountRepository;
import com.banco.cuentas.fakes.InMemoryTransferRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TransferServiceTest {

    private static final String OWNER = "demo-owner";

    private InMemoryAccountRepository accounts;
    private InMemoryTransferRepository transfers;
    private TransferService service;

    @BeforeEach
    void setUp() {
        accounts = new InMemoryAccountRepository();
        accounts.add(new Account(1, "****1001", OWNER, "USD", new BigDecimal("100.00")));
        accounts.add(new Account(2, "****1002", OWNER, "USD", new BigDecimal("50.00")));
        accounts.add(new Account(3, "****1003", OWNER, "EUR", new BigDecimal("10.00")));
        accounts.add(new Account(4, "****2001", "otro", "USD", new BigDecimal("500.00")));
        transfers = new InMemoryTransferRepository();
        service = new TransferService(accounts, transfers);
    }

    private TransferCommand command(String key, long source, long target, String amount, String currency) {
        return new TransferCommand(OWNER, key, source, target, new BigDecimal(amount), currency, "prueba");
    }

    private void assertKind(DomainException.Kind expected, Runnable action) {
        DomainException e = assertThrows(DomainException.class, action::run);
        assertEquals(expected, e.kind());
    }

    @Test
    void givenValidTransfer_whenExecute_thenBalancesMoveAndTwoMovementsAreRecorded() {
        Transfer result = service.execute(command("k1", 1, 2, "25.50", "USD"));

        assertEquals(Transfer.COMPLETED, result.status());
        assertEquals(new BigDecimal("74.50"), accounts.balanceOf(1));
        assertEquals(new BigDecimal("75.50"), accounts.balanceOf(2));
        assertEquals(2, transfers.allMovements().size());
        assertEquals(Movement.Type.DEBIT, transfers.allMovements().get(0).type());
        assertEquals(Movement.Type.CREDIT, transfers.allMovements().get(1).type());
    }

    @Test
    void givenZeroAmount_whenExecute_thenValidationError() {
        assertKind(DomainException.Kind.VALIDATION, () -> service.execute(command("k1", 1, 2, "0", "USD")));
    }

    @Test
    void givenNegativeAmount_whenExecute_thenValidationError() {
        assertKind(DomainException.Kind.VALIDATION, () -> service.execute(command("k1", 1, 2, "-5", "USD")));
    }

    @Test
    void givenThreeDecimals_whenExecute_thenValidationError() {
        assertKind(DomainException.Kind.VALIDATION, () -> service.execute(command("k1", 1, 2, "1.001", "USD")));
    }

    @Test
    void givenMissingIdempotencyKey_whenExecute_thenValidationError() {
        assertKind(DomainException.Kind.VALIDATION, () -> service.execute(command(" ", 1, 2, "5", "USD")));
    }

    @Test
    void givenSameAccount_whenExecute_thenUnprocessable() {
        assertKind(DomainException.Kind.UNPROCESSABLE, () -> service.execute(command("k1", 1, 1, "5", "USD")));
    }

    @Test
    void givenInsufficientBalance_whenExecute_thenUnprocessableAndNothingChanges() {
        assertKind(DomainException.Kind.UNPROCESSABLE, () -> service.execute(command("k1", 1, 2, "100.01", "USD")));

        assertEquals(new BigDecimal("100.00"), accounts.balanceOf(1));
        assertEquals(0, transfers.transferCount());
    }

    @Test
    void givenDifferentCurrencies_whenExecute_thenUnprocessable() {
        assertKind(DomainException.Kind.UNPROCESSABLE, () -> service.execute(command("k1", 1, 3, "5", "USD")));
    }

    @Test
    void givenSameKeyAndPayload_whenExecuteTwice_thenDebitedOnceAndSameTransferReturned() {
        Transfer first = service.execute(command("k1", 1, 2, "10", "USD"));
        Transfer second = service.execute(command("k1", 1, 2, "10.00", "USD"));

        assertSame(first, second);
        assertEquals(new BigDecimal("90.00"), accounts.balanceOf(1));
        assertEquals(1, transfers.transferCount());
    }

    @Test
    void givenSameKeyDifferentPayload_whenExecute_thenConflict() {
        service.execute(command("k1", 1, 2, "10", "USD"));

        assertKind(DomainException.Kind.CONFLICT, () -> service.execute(command("k1", 1, 2, "11", "USD")));
    }

    @Test
    void givenUnknownAccount_whenExecute_thenNotFound() {
        assertKind(DomainException.Kind.NOT_FOUND, () -> service.execute(command("k1", 1, 99, "5", "USD")));
    }

    @Test
    void givenAccountOfAnotherOwner_whenExecute_thenNotFound() {
        assertKind(DomainException.Kind.NOT_FOUND, () -> service.execute(command("k1", 1, 4, "5", "USD")));
    }
}

package com.example.cuentas.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class AccountTest {

    private Account account(String balance) {
        return new Account(1L, "0001", "Demo", "CLI-001", "USD", new BigDecimal(balance));
    }

    @Test
    void givenFunds_whenDebit_thenBalanceDecreases() {
        Account a = account("100.00");
        a.debit(new BigDecimal("40.25"));
        assertEquals(new BigDecimal("59.75"), a.getBalance());
    }

    @Test
    void givenInsufficientFunds_whenDebit_thenBusinessRuleError() {
        Account a = account("10.00");
        DomainException ex = assertThrows(DomainException.class, () -> a.debit(new BigDecimal("10.01")));
        assertEquals("INSUFFICIENT_FUNDS", ex.getCode());
        assertEquals(new BigDecimal("10.00"), a.getBalance());
    }

    @Test
    void givenNonPositiveAmount_whenCredit_thenInvalidAmount() {
        Account a = account("10.00");
        DomainException ex = assertThrows(DomainException.class, () -> a.credit(BigDecimal.ZERO));
        assertEquals("INVALID_AMOUNT", ex.getCode());
    }

    @Test
    void givenAmount_whenCredit_thenBalanceIncreases() {
        Account a = account("10.00");
        a.credit(new BigDecimal("5.50"));
        assertEquals(new BigDecimal("15.50"), a.getBalance());
    }
}

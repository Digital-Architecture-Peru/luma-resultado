package com.example.accounts.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.accounts.domain.Account;
import com.example.accounts.domain.AccountRepository;
import com.example.accounts.domain.BusinessRuleException;
import com.example.accounts.domain.BusinessRuleException.Code;
import com.example.accounts.domain.CoreBankingPort;
import com.example.accounts.domain.Transfer;
import com.example.accounts.domain.TransferCommand;
import com.example.accounts.domain.TransferRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TransferServiceTest {

    private static final long CUSTOMER = 1L;
    private static final String KEY = "key-1";

    private AccountRepository accounts;
    private TransferRepository transfers;
    private CoreBankingPort core;
    private TransferService service;

    @BeforeEach
    void setUp() {
        accounts = mock(AccountRepository.class);
        transfers = mock(TransferRepository.class);
        core = mock(CoreBankingPort.class);
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
        service = new TransferService(accounts, transfers, core, new BigDecimal("1000.00"), clock);

        when(accounts.existsForCustomer(10L, CUSTOMER)).thenReturn(true);
        when(accounts.findByIdForUpdate(10L)).thenReturn(Optional.of(account(10L, "500.00")));
        when(accounts.findByIdForUpdate(20L)).thenReturn(Optional.of(account(20L, "100.00")));
        when(transfers.findByIdempotencyKey(KEY)).thenReturn(Optional.empty());
        when(transfers.insert(any(Transfer.class))).thenAnswer(inv -> ((Transfer) inv.getArgument(0)).withId(99L));
        when(core.authorize(any())).thenReturn(true);
    }

    @Test
    void givenValidCommand_whenExecute_thenBalancesAndMovementsAreUpdated() {
        Transfer result = service.execute(CUSTOMER, KEY, command(10L, 20L, "150.25"));

        assertEquals(99L, result.id());
        assertEquals(Transfer.STATUS_COMPLETED, result.status());
        verify(accounts).updateBalance(10L, new BigDecimal("349.75"));
        verify(accounts).updateBalance(20L, new BigDecimal("250.25"));
        verify(transfers).insertMovement(10L, 99L, "DEBIT", new BigDecimal("150.25"));
        verify(transfers).insertMovement(20L, 99L, "CREDIT", new BigDecimal("150.25"));
    }

    @Test
    void givenInsufficientFunds_whenExecute_thenConflictAndNoChanges() {
        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 20L, "600.00")));

        assertEquals(Code.INSUFFICIENT_FUNDS, ex.code());
        verify(accounts, never()).updateBalance(anyLong(), any());
    }

    @Test
    void givenSameAccount_whenExecute_thenRejected() {
        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 10L, "10.00")));

        assertEquals(Code.SAME_ACCOUNT, ex.code());
    }

    @Test
    void givenRepeatedIdempotencyKey_whenExecute_thenDuplicate() {
        when(transfers.findByIdempotencyKey(KEY)).thenReturn(Optional.of(
                new Transfer(1L, KEY, 10L, 20L, BigDecimal.TEN, "USD", null, "COMPLETED", Instant.now())));

        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 20L, "10.00")));

        assertEquals(Code.DUPLICATE_TRANSFER, ex.code());
        verify(transfers, never()).insert(any());
    }

    @Test
    void givenAmountAboveLimit_whenExecute_thenLimitExceeded() {
        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 20L, "1000.01")));

        assertEquals(Code.LIMIT_EXCEEDED, ex.code());
    }

    @Test
    void givenZeroAmount_whenExecute_thenInvalidAmount() {
        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 20L, "0.00")));

        assertEquals(Code.INVALID_AMOUNT, ex.code());
    }

    @Test
    void givenSourceNotOwnedByCustomer_whenExecute_thenAccountNotFound() {
        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(2L, KEY, command(10L, 20L, "10.00")));

        assertEquals(Code.ACCOUNT_NOT_FOUND, ex.code());
    }

    @Test
    void givenCoreRejects_whenExecute_thenConflict() {
        when(core.authorize(any())).thenReturn(false);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> service.execute(CUSTOMER, KEY, command(10L, 20L, "10.00")));

        assertEquals(Code.CORE_REJECTED, ex.code());
        verify(accounts, never()).updateBalance(eq(10L), any());
    }

    private static Account account(long id, String balance) {
        return new Account(id, "000-" + id, CUSTOMER, "USD", new BigDecimal(balance));
    }

    private static TransferCommand command(long source, long target, String amount) {
        return new TransferCommand(source, target, new BigDecimal(amount), "USD", "prueba");
    }
}

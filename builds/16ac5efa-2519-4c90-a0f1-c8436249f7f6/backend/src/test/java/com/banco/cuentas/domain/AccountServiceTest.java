package com.banco.cuentas.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banco.cuentas.fakes.InMemoryAccountRepository;
import com.banco.cuentas.fakes.InMemoryTransferRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AccountServiceTest {

    private static final String OWNER = "demo-owner";

    private AccountService accountService;
    private TransferService transferService;

    @BeforeEach
    void setUp() {
        var accounts = new InMemoryAccountRepository();
        accounts.add(new Account(1, "****1001", OWNER, "USD", new BigDecimal("100.00")));
        accounts.add(new Account(2, "****1002", OWNER, "USD", new BigDecimal("50.00")));
        accounts.add(new Account(4, "****2001", "otro", "USD", new BigDecimal("500.00")));
        var transfers = new InMemoryTransferRepository();
        accountService = new AccountService(accounts, transfers);
        transferService = new TransferService(accounts, transfers);
    }

    @Test
    void givenOwner_whenList_thenOnlyOwnAccounts() {
        assertEquals(2, accountService.list(OWNER).size());
    }

    @Test
    void givenTransfer_whenMovements_thenAccountSeesItsDebit() {
        transferService.execute(new TransferCommand(OWNER, "k1", 1, 2, new BigDecimal("5"), "USD", ""));

        var movements = accountService.movements(OWNER, 1, 0, 20);

        assertEquals(1, movements.size());
        assertEquals(Movement.Type.DEBIT, movements.get(0).type());
    }

    @Test
    void givenForeignAccount_whenMovements_thenNotFound() {
        var e = assertThrows(DomainException.class, () -> accountService.movements(OWNER, 4, 0, 20));
        assertEquals(DomainException.Kind.NOT_FOUND, e.kind());
    }

    @Test
    void givenInvalidPageSize_whenMovements_thenValidationError() {
        var e = assertThrows(DomainException.class, () -> accountService.movements(OWNER, 1, 0, 1000));
        assertEquals(DomainException.Kind.VALIDATION, e.kind());
    }
}

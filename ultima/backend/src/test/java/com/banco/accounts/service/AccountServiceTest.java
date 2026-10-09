package com.banco.accounts.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.banco.accounts.domain.Account;
import com.banco.accounts.domain.AccountStatus;
import com.banco.accounts.persistence.AccountRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository repository;

    @InjectMocks
    private AccountService service;

    private static Account sample(long id) {
        return new Account(id, "C001", "19400000011234", "SAVINGS", "PEN",
                new BigDecimal("10.50"), AccountStatus.ACTIVE, LocalDate.of(2021, 3, 15));
    }

    @Test
    void givenCustomer_whenList_thenReturnsRepositoryAccounts() {
        when(repository.findByCustomerId("C001")).thenReturn(List.of(sample(1), sample(2)));

        assertEquals(2, service.listAccounts("C001").size());
    }

    @Test
    void givenOwnAccount_whenGet_thenReturnsAccount() {
        when(repository.findByIdAndCustomerId(1L, "C001")).thenReturn(Optional.of(sample(1)));

        assertEquals(1L, service.getAccount("C001", 1L).id());
    }

    @Test
    void givenForeignOrMissingAccount_whenGet_thenThrowsNotFound() {
        when(repository.findByIdAndCustomerId(9L, "C001")).thenReturn(Optional.empty());

        assertThrows(AccountNotFoundException.class, () -> service.getAccount("C001", 9L));
    }

    @Test
    void givenInvalidCustomerId_whenList_thenRejectsWithoutQuerying() {
        assertThrows(IllegalArgumentException.class, () -> service.listAccounts("C001'; DROP"));
        assertThrows(IllegalArgumentException.class, () -> service.listAccounts(null));
        verifyNoInteractions(repository);
    }
}

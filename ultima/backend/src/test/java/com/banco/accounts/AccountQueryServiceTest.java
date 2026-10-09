package com.banco.accounts;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.banco.accounts.api.ApiException;
import com.banco.accounts.api.dto.AccountDto;
import com.banco.accounts.api.dto.AccountPage;
import com.banco.accounts.domain.Account;
import com.banco.accounts.persistence.AccountRepository;
import com.banco.accounts.service.AccountQueryService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AccountQueryServiceTest {

    private static final String CUSTOMER = "CUST-0001";
    private static final UUID ID = UUID.fromString("11111111-1111-4111-8111-111111111101");

    private AccountRepository repository;
    private AccountQueryService service;

    @BeforeEach
    void setUp() {
        repository = mock(AccountRepository.class);
        service = new AccountQueryService(repository);
    }

    private Account sample() {
        return new Account(ID, CUSTOMER, "19100000000101", "SAVINGS", "PEN",
                new BigDecimal("12500.5"), "ACTIVE", Instant.parse("2026-09-30T10:00:00Z"));
    }

    @Test
    void givenCustomerWithAccounts_whenList_thenReturnsMaskedPageWithTotal() {
        when(repository.findByCustomer(CUSTOMER, 20, 0)).thenReturn(List.of(sample()));
        when(repository.countByCustomer(CUSTOMER)).thenReturn(1L);

        AccountPage page = service.list(CUSTOMER, 0, 20);

        assertEquals(1, page.total());
        assertEquals("****0101", page.items().get(0).maskedNumber());
        assertEquals("12500.50", page.items().get(0).balance());
    }

    @Test
    void givenPageTwo_whenList_thenOffsetIsPageTimesSize() {
        when(repository.findByCustomer(any(), anyInt(), anyInt())).thenReturn(List.of());

        service.list(CUSTOMER, 2, 10);

        verify(repository).findByCustomer(CUSTOMER, 10, 20);
    }

    @Test
    void givenSizeAboveMax_whenList_thenBadRequest() {
        ApiException e = assertThrows(ApiException.class,
                () -> service.list(CUSTOMER, 0, AccountQueryService.MAX_PAGE_SIZE + 1));
        assertEquals(400, e.status());
    }

    @Test
    void givenNegativePage_whenList_thenBadRequest() {
        assertEquals(400, assertThrows(ApiException.class, () -> service.list(CUSTOMER, -1, 10)).status());
    }

    @Test
    void givenBlankCustomer_whenList_thenBadRequest() {
        assertEquals(400, assertThrows(ApiException.class, () -> service.list(" ", 0, 10)).status());
    }

    @Test
    void givenExistingAccount_whenGet_thenReturnsDto() {
        when(repository.findByIdAndCustomer(ID, CUSTOMER)).thenReturn(Optional.of(sample()));

        AccountDto dto = service.get(CUSTOMER, ID.toString());

        assertEquals(ID, dto.id());
        assertEquals("PEN", dto.currency());
    }

    @Test
    void givenUnknownAccount_whenGet_thenNotFound() {
        when(repository.findByIdAndCustomer(any(), any())).thenReturn(Optional.empty());

        ApiException e = assertThrows(ApiException.class, () -> service.get(CUSTOMER, ID.toString()));
        assertEquals(404, e.status());
    }

    @Test
    void givenMalformedId_whenGet_thenBadRequest() {
        assertEquals(400, assertThrows(ApiException.class, () -> service.get(CUSTOMER, "abc")).status());
    }
}

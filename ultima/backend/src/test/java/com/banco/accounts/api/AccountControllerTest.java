package com.banco.accounts.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.banco.accounts.domain.Account;
import com.banco.accounts.domain.AccountStatus;
import com.banco.accounts.service.AccountNotFoundException;
import com.banco.accounts.service.AccountService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {

    @Mock
    private AccountService service;

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(new AccountController(service))
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    private static Account sample() {
        return new Account(1L, "C001", "19400000011234", "SAVINGS", "PEN",
                new BigDecimal("15230.50"), AccountStatus.ACTIVE, LocalDate.of(2021, 3, 15));
    }

    @Test
    void givenCustomerHeader_whenListing_thenReturnsMaskedAccounts() throws Exception {
        when(service.listAccounts("C001")).thenReturn(List.of(sample()));

        mvc.perform(get("/api/v1/accounts").header("X-Customer-Id", "C001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].maskedNumber").value("****1234"))
                .andExpect(jsonPath("$[0].balance").value("15230.50"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));
    }

    @Test
    void givenExistingId_whenDetail_thenReturnsAccount() throws Exception {
        when(service.getAccount("C001", 1L)).thenReturn(sample());

        mvc.perform(get("/api/v1/accounts/1").header("X-Customer-Id", "C001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.currency").value("PEN"));
    }

    @Test
    void givenUnknownId_whenDetail_thenProblemDetail404() throws Exception {
        when(service.getAccount("C001", 7L)).thenThrow(new AccountNotFoundException(7L));

        mvc.perform(get("/api/v1/accounts/7").header("X-Customer-Id", "C001"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Cuenta no encontrada"));
    }

    @Test
    void givenMissingHeader_whenListing_thenBadRequest() throws Exception {
        mvc.perform(get("/api/v1/accounts"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenNonNumericId_whenDetail_thenBadRequest() throws Exception {
        mvc.perform(get("/api/v1/accounts/abc").header("X-Customer-Id", "C001"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenInvalidCustomer_whenListing_thenBadRequest() throws Exception {
        when(service.listAccounts("bad id")).thenThrow(new IllegalArgumentException("invalido"));

        mvc.perform(get("/api/v1/accounts").header("X-Customer-Id", "bad id"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("invalido"));
    }
}

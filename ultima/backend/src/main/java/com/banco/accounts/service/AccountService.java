package com.banco.accounts.service;

import com.banco.accounts.domain.Account;
import com.banco.accounts.persistence.AccountRepository;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

    private static final Pattern CUSTOMER_ID = Pattern.compile("^[A-Za-z0-9_-]{1,20}$");

    private final AccountRepository repository;

    public AccountService(AccountRepository repository) {
        this.repository = repository;
    }

    public List<Account> listAccounts(String customerId) {
        return repository.findByCustomerId(requireValid(customerId));
    }

    /** Filtra también por cliente: una cuenta ajena se reporta como inexistente (anti-IDOR). */
    public Account getAccount(String customerId, long id) {
        return repository.findByIdAndCustomerId(id, requireValid(customerId))
                .orElseThrow(() -> new AccountNotFoundException(id));
    }

    private static String requireValid(String customerId) {
        if (customerId == null || !CUSTOMER_ID.matcher(customerId).matches()) {
            throw new IllegalArgumentException("Identificador de cliente invalido");
        }
        return customerId;
    }
}

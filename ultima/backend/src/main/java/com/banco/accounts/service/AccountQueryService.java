package com.banco.accounts.service;

import com.banco.accounts.api.ApiException;
import com.banco.accounts.api.dto.AccountDto;
import com.banco.accounts.api.dto.AccountPage;
import com.banco.accounts.domain.Account;
import com.banco.accounts.persistence.AccountRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AccountQueryService {

    public static final int MAX_PAGE_SIZE = 50;

    private final AccountRepository repository;

    public AccountQueryService(AccountRepository repository) {
        this.repository = repository;
    }

    public AccountPage list(String customerId, int page, int size) {
        requireCustomer(customerId);
        if (page < 0) {
            throw ApiException.badRequest("page debe ser >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw ApiException.badRequest("size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        List<Account> accounts = repository.findByCustomer(customerId, size, page * size);
        long total = repository.countByCustomer(customerId);
        return new AccountPage(accounts.stream().map(AccountDto::from).toList(), page, size, total);
    }

    public AccountDto get(String customerId, String rawId) {
        requireCustomer(customerId);
        UUID id = parseId(rawId);
        return repository.findByIdAndCustomer(id, customerId)
                .map(AccountDto::from)
                .orElseThrow(() -> ApiException.notFound("Cuenta no encontrada"));
    }

    private static void requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank() || customerId.length() > 36) {
            throw ApiException.badRequest("Cabecera X-Customer-Id ausente o inválida");
        }
    }

    private static UUID parseId(String rawId) {
        try {
            return UUID.fromString(rawId);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw ApiException.badRequest("Identificador de cuenta inválido");
        }
    }
}

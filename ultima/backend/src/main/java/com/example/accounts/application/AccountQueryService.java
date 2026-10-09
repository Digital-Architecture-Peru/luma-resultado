package com.example.accounts.application;

import com.example.accounts.domain.Account;
import com.example.accounts.domain.AccountRepository;
import com.example.accounts.domain.BusinessRuleException;
import com.example.accounts.domain.Movement;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountQueryService {

    private static final int MAX_PAGE_SIZE = 50;

    private final AccountRepository accounts;

    public AccountQueryService(AccountRepository accounts) {
        this.accounts = accounts;
    }

    @Transactional(readOnly = true)
    public List<Account> listAccounts(long customerId) {
        return accounts.findByCustomer(customerId);
    }

    @Transactional(readOnly = true)
    public List<Movement> listMovements(long customerId, long accountId, int page, int size) {
        if (!accounts.existsForCustomer(accountId, customerId)) {
            throw new BusinessRuleException(BusinessRuleException.Code.ACCOUNT_NOT_FOUND, "Cuenta no encontrada");
        }
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        return accounts.findMovements(accountId, safePage, safeSize);
    }
}

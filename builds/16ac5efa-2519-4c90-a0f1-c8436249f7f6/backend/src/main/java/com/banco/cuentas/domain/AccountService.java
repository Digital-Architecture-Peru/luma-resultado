package com.banco.cuentas.domain;

import com.banco.cuentas.persistence.AccountRepository;
import com.banco.cuentas.persistence.TransferRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class AccountService {

    static final int MAX_PAGE_SIZE = 100;

    private final AccountRepository accounts;
    private final TransferRepository transfers;

    @Inject
    public AccountService(AccountRepository accounts, TransferRepository transfers) {
        this.accounts = accounts;
        this.transfers = transfers;
    }

    public List<Account> list(String ownerId) {
        return accounts.findByOwner(ownerId);
    }

    public List<Movement> movements(String ownerId, long accountId, int page, int size) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw DomainException.validation("page >= 0 y size entre 1 y " + MAX_PAGE_SIZE);
        }
        accounts.findById(accountId)
                .filter(account -> account.ownerId().equals(ownerId))
                .orElseThrow(() -> DomainException.notFound("Cuenta " + accountId + " no encontrada"));
        return transfers.findMovements(accountId, page, size);
    }
}

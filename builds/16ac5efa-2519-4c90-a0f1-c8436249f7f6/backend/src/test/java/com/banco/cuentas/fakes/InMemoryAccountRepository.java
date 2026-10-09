package com.banco.cuentas.fakes;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.persistence.AccountRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

public class InMemoryAccountRepository implements AccountRepository {

    private final Map<Long, Account> store = new TreeMap<>();

    public void add(Account account) {
        store.put(account.id(), account);
    }

    public BigDecimal balanceOf(long id) {
        return store.get(id).balance();
    }

    @Override
    public List<Account> findByOwner(String ownerId) {
        return store.values().stream().filter(a -> a.ownerId().equals(ownerId)).toList();
    }

    @Override
    public Optional<Account> findById(long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Optional<Account> findByIdForUpdate(long id) {
        return findById(id);
    }

    @Override
    public void updateBalance(long id, BigDecimal newBalance) {
        Account a = store.get(id);
        store.put(id, new Account(a.id(), a.numberMasked(), a.ownerId(), a.currency(), newBalance));
    }
}

package com.banco.cuentas.service;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.MovementType;
import com.banco.cuentas.domain.TransferReceipt;
import com.banco.cuentas.repository.AccountRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/** Doble en memoria del puerto de persistencia, para probar el dominio sin base de datos. */
class InMemoryAccountRepository implements AccountRepository {

    final Map<Long, Account> accounts = new LinkedHashMap<>();
    final Map<String, TransferReceipt> transfers = new LinkedHashMap<>();
    final List<Movement> movements = new ArrayList<>();
    List<Long> lastLockOrder = List.of();

    InMemoryAccountRepository add(long id, String currency, String balance) {
        accounts.put(id, new Account(id, "000" + id, "Cuenta " + id, currency, new BigDecimal(balance)));
        return this;
    }

    BigDecimal balanceOf(long id) {
        return accounts.get(id).balance();
    }

    @Override
    public List<Account> findAll() {
        return new ArrayList<>(accounts.values());
    }

    @Override
    public boolean accountExists(long accountId) {
        return accounts.containsKey(accountId);
    }

    @Override
    public List<Account> lockByIds(List<Long> accountIds) {
        lastLockOrder = List.copyOf(accountIds);
        return accountIds.stream().map(accounts::get).filter(a -> a != null)
                .sorted(Comparator.comparingLong(Account::id)).toList();
    }

    @Override
    public void updateBalance(long accountId, BigDecimal newBalance) {
        accounts.computeIfPresent(accountId, (k, a) -> a.withBalance(newBalance));
    }

    @Override
    public Optional<TransferReceipt> findTransferByKey(String idempotencyKey) {
        return Optional.ofNullable(transfers.get(idempotencyKey));
    }

    @Override
    public void insertTransfer(TransferReceipt receipt) {
        transfers.put(receipt.idempotencyKey(), receipt);
    }

    @Override
    public void insertMovement(long accountId, UUID transferId, MovementType type, BigDecimal amount,
            Instant at) {
        movements.add(new Movement(movements.size() + 1L, accountId, transferId, type, amount, at));
    }

    @Override
    public List<Movement> findMovements(long accountId) {
        return movements.stream().filter(m -> m.accountId() == accountId).toList();
    }
}

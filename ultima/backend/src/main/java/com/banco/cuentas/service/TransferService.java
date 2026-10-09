package com.banco.cuentas.service;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.AccountNotFoundException;
import com.banco.cuentas.domain.IdempotencyConflictException;
import com.banco.cuentas.domain.InsufficientFundsException;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.MovementType;
import com.banco.cuentas.domain.TransferCommand;
import com.banco.cuentas.domain.TransferReceipt;
import com.banco.cuentas.domain.ValidationException;
import com.banco.cuentas.integration.CoreBankingGateway;
import com.banco.cuentas.repository.AccountRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Caso de uso: transferencia entre cuentas propias (misma moneda), atómica e idempotente. */
@ApplicationScoped
public class TransferService {

    private final AccountRepository repository;
    private final CoreBankingGateway gateway;
    private final Clock clock;

    public TransferService(AccountRepository repository, CoreBankingGateway gateway, Clock clock) {
        this.repository = repository;
        this.gateway = gateway;
        this.clock = clock;
    }

    public List<Account> listAccounts() {
        return repository.findAll();
    }

    public List<Movement> listMovements(long accountId) {
        if (!repository.accountExists(accountId)) {
            throw new AccountNotFoundException("La cuenta " + accountId + " no existe.");
        }
        return repository.findMovements(accountId);
    }

    @Transactional
    public TransferReceipt transfer(TransferCommand cmd) {
        TransferValidator.validate(cmd);

        Optional<TransferReceipt> previous = repository.findTransferByKey(cmd.idempotencyKey());
        if (previous.isPresent()) {
            return replay(previous.get(), cmd);
        }

        // Bloqueo en orden de id ascendente para evitar deadlocks entre transferencias cruzadas.
        List<Long> ids = List.of(cmd.sourceAccountId(), cmd.targetAccountId()).stream().sorted().toList();
        List<Account> locked = repository.lockByIds(ids);
        Account source = find(locked, cmd.sourceAccountId());
        Account target = find(locked, cmd.targetAccountId());
        ensureCurrency(source, cmd.currency());
        ensureCurrency(target, cmd.currency());
        if (source.balance().compareTo(cmd.amount()) < 0) {
            throw new InsufficientFundsException();
        }

        Instant now = clock.instant();
        TransferReceipt receipt = new TransferReceipt(UUID.randomUUID(), cmd.idempotencyKey(),
                source.id(), target.id(), cmd.amount(), cmd.currency(), describe(cmd), now);
        repository.insertTransfer(receipt);
        repository.updateBalance(source.id(), source.balance().subtract(cmd.amount()));
        repository.updateBalance(target.id(), target.balance().add(cmd.amount()));
        repository.insertMovement(source.id(), receipt.id(), MovementType.DEBIT, cmd.amount(), now);
        repository.insertMovement(target.id(), receipt.id(), MovementType.CREDIT, cmd.amount(), now);

        gateway.notifyTransferCompleted(receipt);
        return receipt;
    }

    private static TransferReceipt replay(TransferReceipt stored, TransferCommand cmd) {
        if (!stored.sameRequestAs(cmd)) {
            throw new IdempotencyConflictException();
        }
        return stored;
    }

    private static Account find(List<Account> accounts, long id) {
        return accounts.stream()
                .filter(a -> a.id() == id)
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("La cuenta " + id + " no existe."));
    }

    private static void ensureCurrency(Account account, String currency) {
        if (!account.currency().equals(currency)) {
            throw new ValidationException("La cuenta " + account.id() + " no opera en " + currency + ".");
        }
    }

    private static String describe(TransferCommand cmd) {
        return cmd.description() == null ? "" : cmd.description().strip();
    }
}

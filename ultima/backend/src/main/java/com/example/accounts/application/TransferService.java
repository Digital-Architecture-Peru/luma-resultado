package com.example.accounts.application;

import static com.example.accounts.domain.BusinessRuleException.Code.ACCOUNT_NOT_FOUND;
import static com.example.accounts.domain.BusinessRuleException.Code.CORE_REJECTED;
import static com.example.accounts.domain.BusinessRuleException.Code.CURRENCY_MISMATCH;
import static com.example.accounts.domain.BusinessRuleException.Code.DUPLICATE_TRANSFER;
import static com.example.accounts.domain.BusinessRuleException.Code.INSUFFICIENT_FUNDS;
import static com.example.accounts.domain.BusinessRuleException.Code.INVALID_AMOUNT;
import static com.example.accounts.domain.BusinessRuleException.Code.LIMIT_EXCEEDED;
import static com.example.accounts.domain.BusinessRuleException.Code.SAME_ACCOUNT;

import com.example.accounts.domain.Account;
import com.example.accounts.domain.AccountRepository;
import com.example.accounts.domain.BusinessRuleException;
import com.example.accounts.domain.CoreBankingPort;
import com.example.accounts.domain.Transfer;
import com.example.accounts.domain.TransferCommand;
import com.example.accounts.domain.TransferRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.stream.LongStream;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferService {

    private final AccountRepository accounts;
    private final TransferRepository transfers;
    private final CoreBankingPort coreBanking;
    private final BigDecimal maxAmount;
    private final Clock clock;

    @Autowired
    public TransferService(AccountRepository accounts,
                           TransferRepository transfers,
                           CoreBankingPort coreBanking,
                           @Value("${transfers.max-amount:10000.00}") BigDecimal maxAmount) {
        this(accounts, transfers, coreBanking, maxAmount, Clock.systemUTC());
    }

    TransferService(AccountRepository accounts, TransferRepository transfers,
                    CoreBankingPort coreBanking, BigDecimal maxAmount, Clock clock) {
        this.accounts = accounts;
        this.transfers = transfers;
        this.coreBanking = coreBanking;
        this.maxAmount = maxAmount;
        this.clock = clock;
    }

    @Transactional
    public Transfer execute(long customerId, String idempotencyKey, TransferCommand command) {
        validateCommand(command);
        if (transfers.findByIdempotencyKey(idempotencyKey).isPresent()) {
            throw new BusinessRuleException(DUPLICATE_TRANSFER, "La clave de idempotencia ya fue utilizada");
        }
        if (!accounts.existsForCustomer(command.sourceAccountId(), customerId)) {
            throw new BusinessRuleException(ACCOUNT_NOT_FOUND, "Cuenta origen no encontrada");
        }

        Map<Long, Account> locked = lockInOrder(command);
        return apply(idempotencyKey, command,
                locked.get(command.sourceAccountId()), locked.get(command.targetAccountId()));
    }

    private Transfer apply(String key, TransferCommand command, Account source, Account target) {
        if (!source.currency().equals(command.currency()) || !target.currency().equals(command.currency())) {
            throw new BusinessRuleException(CURRENCY_MISMATCH, "Las cuentas deben estar en la moneda indicada");
        }
        if (!source.canCover(command.amount())) {
            throw new BusinessRuleException(INSUFFICIENT_FUNDS, "Saldo insuficiente");
        }
        if (!coreBanking.authorize(command)) {
            throw new BusinessRuleException(CORE_REJECTED, "Operación rechazada por el core bancario");
        }

        accounts.updateBalance(source.id(), source.balance().subtract(command.amount()));
        accounts.updateBalance(target.id(), target.balance().add(command.amount()));

        Transfer saved = transfers.insert(new Transfer(null, key, source.id(), target.id(), command.amount(),
                command.currency(), command.description(), Transfer.STATUS_COMPLETED, Instant.now(clock)));
        transfers.insertMovement(source.id(), saved.id(), "DEBIT", command.amount());
        transfers.insertMovement(target.id(), saved.id(), "CREDIT", command.amount());
        return saved;
    }

    /** Bloquea ambas cuentas en orden ascendente de id para evitar deadlocks. */
    private Map<Long, Account> lockInOrder(TransferCommand command) {
        return LongStream.of(command.sourceAccountId(), command.targetAccountId())
                .sorted()
                .boxed()
                .map(id -> accounts.findByIdForUpdate(id)
                        .orElseThrow(() -> new BusinessRuleException(ACCOUNT_NOT_FOUND, "Cuenta no encontrada: " + id)))
                .collect(Collectors.toMap(Account::id, a -> a));
    }

    private void validateCommand(TransferCommand command) {
        if (command.sourceAccountId() == command.targetAccountId()) {
            throw new BusinessRuleException(SAME_ACCOUNT, "La cuenta origen y destino deben ser distintas");
        }
        if (command.amount() == null || command.amount().signum() <= 0) {
            throw new BusinessRuleException(INVALID_AMOUNT, "El monto debe ser mayor que cero");
        }
        if (command.amount().compareTo(maxAmount) > 0) {
            throw new BusinessRuleException(LIMIT_EXCEEDED, "El monto supera el límite por operación");
        }
    }
}
